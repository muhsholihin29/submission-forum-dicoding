/* istanbul ignore file */
const pool = require('../src/Infrastructures/database/postgres/pool');

const ThreadsTableTestHelper = {
    async addThread({
                         id = 'thread-123', userId = 'user-123', title = 'secret', body = 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia'
                     }) {
        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4,  \'2023-01-01\')',
            values: [id, userId, title, body],
        };

        await pool.query(query);
    },

    async findThreadsById(id) {
        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [id],
        };

        const result = await pool.query(query);
        return result.rows;
    },

    async cleanTable() {
        await pool.query('TRUNCATE TABLE threads');
    },
};

module.exports = ThreadsTableTestHelper;
