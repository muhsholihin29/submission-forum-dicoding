const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Reply = require('../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../Domains/replies/ReplyRepository');

class ReplyRepositoryPostgres extends ReplyRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addReply(reply) {
        const {content, threadId, commentId, owner} = reply;
        const id = `reply-${this._idGenerator()}`;
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5, now(), false) RETURNING id, content, owner',
            values: [id, threadId, commentId, content, owner],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('gagal menambahkan balasan');
        }

        return result.rows[0];
    }

    async getReply(threadId, commentId, replyId) {
        const query = {
            text: 'SELECT id, thread_id as "threadId", comment_id as "commentId", owner, content, date FROM replies WHERE id = $1 and thread_id = $2 and comment_id = $3 and is_delete = false',
            values: [replyId, threadId, commentId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
        return new Reply({...result.rows[0]})
    }

    async getRepliesInCommentsThread(threadId, commentId) {
        const query = {
            text: 'SELECT r.id, (case when is_delete then \'**komentar telah dihapus**\' else content end) as content, date, u.username FROM replies r join users u on r.owner = u.id WHERE thread_id = $1 and comment_id = $2 order by date',
            values: [threadId, commentId],
        };

        const result = await this._pool.query(query);

        return result.rows
    }

    async verifyReplyOwner(replyId, userId) {
        const query = {
            text: 'SELECT owner FROM replies WHERE id = $1 and is_delete = false',
            values: [replyId],
        };
        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('balasan tidak ditemukan');
        }
        if (result.rows[0].owner !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async deleteReply(replyId) {
        const query = {
            text: 'UPDATE replies set is_delete = true WHERE id = $1',
            values: [replyId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('balasan gagal dihapus. Id tidak ditemukan');
        }
    }
}

module.exports = ReplyRepositoryPostgres;
