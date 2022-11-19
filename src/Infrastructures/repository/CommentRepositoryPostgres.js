const InvariantError = require('../../Commons/exceptions/InvariantError');
const Comments = require('../../Domains/comments/entities/Comment');
const CommentsRepository = require('../../Domains/comments/CommentRepository');
const pool = require("../database/postgres/pool");

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

        console.log("mytag "+JSON.stringify(result.rows[0]))
        return new Comments({ ...result.rows[0] });
    }

    async getComment(commentId) {
        this._verifyId(commentId)
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [commentId],
        };

        const result = await this._pool.query(query);

        console.log("mytag "+JSON.stringify(result.rows[0]))
        return new Comments({ ...result.rows[0] });
    }

    async deleteComment(commentId) {
        console.log('mytag4 '+commentId)

    }

    _verifyId(commentId) {
        if (!commentId) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof commentId !== 'string') {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentRepositoryPostgres;