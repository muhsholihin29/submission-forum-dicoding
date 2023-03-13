const InvariantError = require('../../Commons/exceptions/InvariantError');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');
const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const Comments = require('../../Domains/comments/entities/Comment');
const CommentsRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentsRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(comment) {
        const {content, threadId, userId} = comment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, now(), false) RETURNING id, content, user_id as owner',
            values: [id, threadId, userId, content],
        };
        const result = await this._pool.query(query);
        return result.rows[0];
    }

    async getComment(threadId, commentId) {
        const query = {
            text: 'SELECT comments.id, u.username, content, text(date) as date FROM comments join users u on comments.user_id = u.id WHERE comments.id = $1 and thread_id = $2 and is_delete = false order by date asc ',
            values: [commentId, threadId],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
        return new Comments({...result.rows[0]})
    }

    async getCommentsByThreadId(threadId) {
        const query = {
            text: `SELECT c.id, u.username, text(date) as date, content, is_delete FROM comments c join users u on u.id = c.user_id WHERE thread_id = $1 order by date`,
            values: [threadId],
        };

        const result = await this._pool.query(query);

        return result.rows;
    }

    async verifyCommentOwner(commentId, userId) {
        const queryCheckComment = {
            text: 'SELECT user_id FROM comments WHERE id = $1 and is_delete = false',
            values: [commentId],
        };
        const resultCheckComment = await this._pool.query(queryCheckComment);
        if (!resultCheckComment.rowCount) {
            throw new NotFoundError('komentar tidak ditemukan');
        }
        if (resultCheckComment.rows[0].user_id !== userId) {
            throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
        }
    }

    async deleteComment(threadId, commentId, userId) {
        const query = {
            text: 'UPDATE comments set is_delete = true WHERE id = $1 and thread_id = $2 and user_id = $3',
            values: [commentId, threadId, userId],
        };

        const result = await this._pool.query(query);
        if (!result.rowCount) {
            throw new NotFoundError('Komentar gagal dihapus. Id tidak ditemukan');
        }
    }

}

module.exports = CommentRepositoryPostgres;
