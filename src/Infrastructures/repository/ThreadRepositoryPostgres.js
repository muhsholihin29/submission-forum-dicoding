const InvariantError = require('../../Commons/exceptions/InvariantError');
const Threads = require('../../Domains/threads/entities/Thread');
const ThreadsRepository = require('../../Domains/threads/ThreadRepository');

class ThreadRepositoryPostgres extends ThreadsRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(registerThreads) {
        const { username, title, body } = registerThreads;
        const id = `user-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, NOW()) RETURNING id, title, body, username',
            values: [id, username, title, body],
        };

        const result = await this._pool.query(query);

        return new Threads({ ...result.rows[0] });
    }

    async getThread(thread_id) {

        const query = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [thread_id],
        };

        const result = await this._pool.query(query);

        return new Threads({ ...result.rows[0] });
    }
}

module.exports = ThreadRepositoryPostgres;