const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const Reply = require('../../../Domains/replies/entities/Reply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const CommentsTableTestHelper = require("../../../../tests/CommentsTableTestHelper");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const InvariantError = require("../../../Commons/exceptions/InvariantError");

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
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);
            await ThreadsTableTestHelper.addThread({ id: addReply.threadId });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id:  'thread-123'});

            // Action
            await replyRepositoryPostgres.addReply(addReply);

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
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(replyRepositoryPostgres.getReply('thread-123', 'comment-123'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should return replies correctly', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({ id: 'reply-123', thread_id: 'thread-123', comment_id: 'comment-123' });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action
            const reply = await replyRepositoryPostgres.getReply('thread-123', 'comment-123', 'reply-123');

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

    describe('verifyReplyOwner', () => {
        it('should throw NotfoundError when reply not found', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should return user and owner mismatch', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({ id: 'reply-123', thread_id: 'thread-123', comment_id: 'comment-123' });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'dicoding'))
                .rejects
                .toThrowError(AuthorizationError);
        });

        it('should verify user and owner correctly', async () => {
            // Arrange
            await RepliesTableTestHelper.addReply({ id: 'reply-123', thread_id: 'thread-123', comment_id: 'comment-123' });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
                .resolves.not.toThrow(NotFoundError);
            await expect(replyRepositoryPostgres.verifyReplyOwner('reply-123', 'user-123'))
                .resolves.not.toThrow(AuthorizationError);
        });
    });

    describe('getRepliesInCommentsThread', () => {

        it('should return replies correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await RepliesTableTestHelper.addReply({ id: 'reply-123', thread_id: 'thread-123', comment_id: 'comment-123' });
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action
            const reply = await replyRepositoryPostgres.getRepliesInCommentsThread('thread-123', 'comment-123', 'reply-123');

            // Assert
            expect(reply).toStrictEqual([{
                id: 'reply-123',
                content: 'Dicoding Indonesia',
                date: '2023-01-01',
                username: 'dicoding',
                is_delete: false
            }]);
        });
    });

    describe('deleteReply', () => {
        it('should throw NotfoundError when reply not found', async () => {
            // Arrange
            const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(replyRepositoryPostgres.deleteReply('reply-123'))
                .rejects
                .toThrowError(NotFoundError);
        });

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
