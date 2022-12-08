const InvariantError = require('../../Commons/exceptions/InvariantError');
const ThreadsRepository = require('../../Domains/threads/ThreadRepository');
const Thread = require("../../Domains/threads/entities/AddThread");

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
            text: 'INSERT INTO threads VALUES($1, $2, $3, $4, NOW()) RETURNING id, title, username as owner',
            values: [id, username, title, body],
        };

        const result = await this._pool.query(query);

        return JSON.parse(JSON.stringify(result.rows[0]));
    }

    async getThread(thread_id) {

        const queryThread = {
            text: 'SELECT * FROM threads WHERE id = $1',
            values: [thread_id],
        };

        const queryComments = {
            text: 'SELECT id, username, date, content, is_delete FROM comments WHERE thread_id = $1',
            values: [thread_id],
        };

        const resultThread = await this._pool.query(queryThread);
        const resultComment = await this._pool.query(queryComments);

        if (resultThread.rows.length > 0) {
            resultComment.rows.forEach((item, index) => {
                if (item.is_delete === 1) {
                    item.content = '**komentar telah dihapus**'
                }
                delete item.is_delete;
            });
            resultThread.rows[0].comments = resultComment.rows
            return JSON.parse(JSON.stringify(resultThread.rows[0]));
        } else {
            throw new InvariantError('thread tidak ditemukan');
        }
    }
}

module.exports = ThreadRepositoryPostgres;