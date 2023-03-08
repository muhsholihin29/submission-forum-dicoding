/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
                      id = 'comment-123', thread_id = 'thread-123', userId = 'user-123', content = 'Dicoding Indonesia'
                     }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4, \'2023-01-01\', false)',
            values: [id, thread_id, userId, content],
        };

        await pool.query(query);
    },

    async getComment(threadId, commentId) {
        const query = {
            text: 'SELECT id, thread_id as "threadId", user_id, content, date FROM comments WHERE id = $1 and thread_id = $2 and is_delete = false',
            values: [commentId, threadId],
        };

        const result = await pool.query(query);

        return result.rows
    },

    async deleteComment(threadId, commentId) {
        const query = {
            text: 'UPDATE comments set is_delete = true WHERE id = $1 and thread_id = $2',
            values: [commentId, threadId],
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comments');
    },
};

module.exports = CommentsTableTestHelper;
