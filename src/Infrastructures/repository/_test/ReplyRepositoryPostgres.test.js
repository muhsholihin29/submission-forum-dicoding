const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const Reply = require('../../../Domains/replies/entities/Reply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");

describe('ReplyRepositoryPostgres', () => {

    beforeEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable()
        await RepliesTableTestHelper.cleanTable()
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addReply function', () => {
        it('should persist add reply', async () => {
            // Arrange
            const addReply = new Reply({
                content: 'dicoding',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
            await ThreadsTableTestHelper.addThread({ id: addReply.threadId });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id:  'thread-123'});

            // Action
            await userRepositoryPostgres.addReply(addReply);

            // Assert
            const threads = await RepliesTableTestHelper.getReply('thread-123', 'comment-123', 'reply-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added reply correctly', async () => {
            // Arrange
            const addReply = new Reply({
                content: 'dicoding',
                threadId: 'thread-123',
                commentId: 'thread-123',
                owner: 'user-123',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
            await ThreadsTableTestHelper.addThread({ id: addReply.threadId });
            await CommentsTableTestHelper.addComment({ id: addReply.commentId });

            // Action
            const addedReply = await commentRepositoryPostgres.addReply(addReply);

            // Assert
            expect(addedReply).toStrictEqual({
                id: 'reply-123',
                content: 'dicoding',
                owner: addReply.owner
            });
        });
    });

    describe('getReply', () => {
        it('should throw NotfoundError when comment not found', async () => {
            // Arrange
            const userRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(userRepositoryPostgres.getReply('thread-123', 'comment-123'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should return user id correctly', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({ id: 'reply-123', thread_id: 'thread-123', comment_id: 'comment-123' });
            const userRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action
            const reply = await userRepositoryPostgres.getReply('thread-123', 'comment-123', 'reply-123');

            // Assert
            expect(reply).toStrictEqual(new Reply({
                id: 'reply-123',
                owner: 'user-123',
                content: 'Dicoding Indonesia',
                commentId: 'comment-123',
                threadId: 'thread-123'
            }));
        });
    });

    describe('deleteReply', () => {
        it('should delete comment from database', async () => {
            // Arrange
            const commentRepositoryPostgres = new ReplyRepositoryPostgres(pool);
            const replyId = 'reply-123';
            const commentId = 'comment-123';
            const threadId = 'thread-123';
            const owner = 'dicoding'
            await ThreadsTableTestHelper.addThread({ id: threadId });
            await CommentsTableTestHelper.addComment({ id: commentId });
            await RepliesTableTestHelper.addReply({ id: replyId, thread_id: threadId, comment_id: commentId, owner: owner });

            // Action
            await commentRepositoryPostgres.deleteReply(replyId);

            // Assert
            const replies = await RepliesTableTestHelper.getReply(threadId, commentId, replyId);
            expect(replies).toHaveLength(0);
        });
    });
});
