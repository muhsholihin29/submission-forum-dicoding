const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const Thread = require('../../../Domains/threads/entities/Thread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist register user', async () => {
            // Arrange
            const registerThread = new Thread({
                title: 'dicoding',
                body: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                username: 'user-123',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await userRepositoryPostgres.addThread(registerThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('user-123');
            expect(threads).toHaveLength(1);
        });

        it('should return registered user correctly', async () => {
            // Arrange
            const registerThread = new Thread({
                title: 'dicoding',
                body: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                username: 'user-123',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const registeredThread = await userRepositoryPostgres.addThread(registerThread);

            // Assert
            expect(registeredThread).toStrictEqual(new Thread({
                id: 'user-123',
                title: 'dicoding',
                body: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
                username: registerThread.username
            }));
        });
    });
});