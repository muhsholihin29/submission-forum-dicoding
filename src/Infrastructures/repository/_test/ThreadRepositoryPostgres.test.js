const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const Thread = require('../../../Domains/threads/entities/AddThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe('ThreadRepositoryPostgres', () => {
    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addThread function', () => {
        it('should persist add thread', async () => {
            // Arrange
            const userId = 'user-123';
            const addThread = new Thread({
                title: 'dicoding',
                body: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            await userRepositoryPostgres.addThread(userId, addThread);

            // Assert
            const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added thread correctly', async () => {
            // Arrange
            const userId = 'user-123';
            const addThread = new Thread({
                title: 'dicoding',
                body: 'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedThread = await threadRepositoryPostgres.addThread(userId, addThread);

            // Assert
            expect(addedThread).toStrictEqual({
                id: 'thread-123',
                title: 'dicoding',
                owner: userId
            });
        });
    });

    describe('getThread function', () => {
        it('should persist thread', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            const userRepositoryPostgres = new ThreadRepositoryPostgres(pool);

            // Action\
            const threads = await userRepositoryPostgres.getThreadById('thread-123');

            // Assert
            expect(threads.id).toEqual('thread-123');
        });

        it('should return throw NotFoundError when thread not found', async () => {
            // Arrange
            const userRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

            // Assert
            await expect(userRepositoryPostgres.getThreadById('thread-123'))
                .rejects.toThrow(NotFoundError);
        });
    });
});
