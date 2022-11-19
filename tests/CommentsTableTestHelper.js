/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
                      id = 'comment-123', thread_id = 'thread-123', username = 'secret', content = 'Dicoding Indonesia', date = '2021-08-08T07:26:21.338Z'
                  }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, now())',
            values: [id, thread_id, username, content],
        };

        await pool.query(query);
    },

    async getComment(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async deleteComment(commentId) {
        const query = {
            text: 'DELETE FROM comments WHERE id = $1',
            values: [commentId],
        };

        await this._pool.query(query);
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comments');
    },
};

module.exports = CommentsTableTestHelper;