/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const CommentsTableTestHelper = {
    async addComment({
                      id = 'user-123', thread_id = 'thread-123', username = 'secret', content = 'Dicoding Indonesia', date = '2021-08-08T07:26:21.338Z'
                  }) {
        const query = {
            text: 'INSERT INTO comments VALUES($1, $2, $3, $4)',
            values: [id, thread_id, username, content, date],
        };

        await pool.query(query);
    },

    async findCommentsById(id) {
        const query = {
            text: 'SELECT * FROM comments WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE comments');
    },
};

module.exports = CommentsTableTestHelper;