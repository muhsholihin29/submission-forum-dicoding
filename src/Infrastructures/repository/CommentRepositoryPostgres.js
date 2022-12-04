const InvariantError = require('../../Commons/exceptions/InvariantError');
const Comments = require('../../Domains/comments/entities/Comment');
const CommentsRepository = require('../../Domains/comments/CommentRepository');

class CommentRepositoryPostgres extends CommentsRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addComment(comment) {
        const { content, threadId, username } = comment;
        const id = `comment-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, now()) RETURNING id, thread_id as "threadId", content, username',
            values: [id, threadId, username, content],
        };

        const result = await this._pool.query(query);

        return new Comments({ ...result.rows[0] });
    }

    async getComment(threadId, commentId) {
        const query = {
            text: 'SELECT id, thread_id as "threadId", username, content, date FROM comments WHERE id = $1 and thread_id = $2',
            values: [commentId, threadId],
        };

        const result = await this._pool.query(query);

        if (result.rows.length > 0){
            return new Comments({ ...result.rows[0] })
        } else {
            throw new InvariantError('komentar tidak ditemukan');
        }
    }

    async deleteComment(threadId, commentId, username) {
        const query = {
            text: 'DELETE FROM comments WHERE id = $1 and thread_id = $2 and username = $3',
            values: [commentId, threadId, username],
        };

        await this._pool.query(query);
    }

}

module.exports = CommentRepositoryPostgres;