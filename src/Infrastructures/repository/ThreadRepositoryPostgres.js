const ThreadsRepository = require('../../Domains/threads/ThreadRepository');
const NotFoundError = require("../../Commons/exceptions/NotFoundError");
const InvariantError = require("../../Commons/exceptions/InvariantError");

class ThreadRepositoryPostgres extends ThreadsRepository {
    constructor(pool, idGenerator) {
        super();
        this._pool = pool;
        this._idGenerator = idGenerator;
    }

    async addThread(userId, thread) {
        const { title, body } = thread;
        const id = `thread-${this._idGenerator()}`;

        const query = {
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, NOW()) RETURNING id, title, user_id as owner',
            values: [id, userId, title, body],
        };

        const result = await this._pool.query(query);

        if (!result.rowCount) {
            throw new InvariantError('Gagal menambahkan thread');
        }

        return result.rows[0];
    }

    async getThreadById(threadId) {
        const queryThread = {
            text: 'SELECT t.id, t.title, t.body, t.date, u.username FROM threads t join users u on u.id = t.user_id WHERE t.id = $1',
            values: [threadId],
        };
        const resultThread = await this._pool.query(queryThread);

        if (!resultThread.rowCount) {
            throw new NotFoundError('thread tidak ditemukan');
        }

        return resultThread.rows[0]
    }
}

module.exports = ThreadRepositoryPostgres;
