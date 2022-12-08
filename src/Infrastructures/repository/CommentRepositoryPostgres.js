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
        const { content, threadId, username } = comment;
        const id = `comment-${this._idGenerator()}`;

        const queryCheckThread = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [threadId],
        };

        const resultCheckThread = await this._pool.query(queryCheckThread);

        if (resultCheckThread.rows.length > 0) {
            const query = {
                text: 'INSERT INTO comments VALUES($1, $2, $3, $4, now()) RETURNING id, content, username as owner',
                values: [id, threadId, username, content],
            };

            const result = await this._pool.query(query);

            return JSON.parse(JSON.stringify(result.rows[0]));
        } else {
            throw new NotFoundError('Thread tidak ditemukan');
        }
    }

    async getComment(threadId, commentId) {
        const query = {
            text: 'SELECT id, thread_id as "threadId", username, content, date FROM comments WHERE id = $1 and thread_id = $2 and is_delete = 0',
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
        const queryCheckComment = {
            text: 'SELECT username FROM comments WHERE id = $1 and thread_id = $2 and is_delete = 0',
            values: [commentId, threadId],
        };
        const resultCheckComment = await this._pool.query(queryCheckComment);
        if (resultCheckComment.rows.length > 0) {
            if (resultCheckComment.rows[0].username !== username) {
                throw new AuthorizationError('Missing Authentication');
            }

            const query = {
                text: 'UPDATE comments set is_delete = 1 WHERE id = $1 and thread_id = $2 and username = $3',
                values: [commentId, threadId, username],
            };

            await this._pool.query(query);
        } else {
            throw new NotFoundError('komentar tidak ditemukan');
        }
    }

}

module.exports = CommentRepositoryPostgres;