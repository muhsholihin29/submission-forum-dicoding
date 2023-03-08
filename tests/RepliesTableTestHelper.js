/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const RepliesTableTestHelper = {
    async addReply({
                      id = 'replies-123', thread_id = 'thread-123', comment_id = 'comment-123', content = 'Dicoding Indonesia', owner = 'user-123'
                     }) {
        const query = {
            text: 'INSERT INTO replies VALUES($1, $2, $3, $4, $5,  \'2023-01-01\', false)',
            values: [id, thread_id, comment_id, content, owner],
        };

        await pool.query(query);
    },

    async getReply(threadId, commentId, replyId) {
        const query = {
            text: 'SELECT id, thread_id as "threadId", comment_id as "commentId", owner, content, date FROM replies WHERE id = $1 and thread_id = $2 and comment_id = $3 and is_delete = false',
            values: [replyId, threadId, commentId],
        };

        const result = await pool.query(query);

        return result.rows
    },

    async deleteReply(threadId, commentId, replyId) {
        const query = {
            text: 'UPDATE replies set is_delete = true WHERE id = $1 and thread_id = $2 and comment_id = $3',
            values: [replyId, threadId, commentId],
        };

        await pool.query(query);
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE replies');
    },
};

module.exports = RepliesTableTestHelper;
