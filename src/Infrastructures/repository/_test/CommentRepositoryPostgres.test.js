const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const Comment = require('../../../Domains/comments/entities/Comment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable()
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment', async () => {
            // Arrange
            const addComment = new Comment({
                content: 'dicoding',
                threadId: 'thread-123',
                username: 'user-123',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const userRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await ThreadsTableTestHelper.addThread({ id: addComment.threadId });

            // Action
            await userRepositoryPostgres.addComment(addComment);

            // Assert
            const threads = await CommentsTableTestHelper.getComment('thread-123', 'comment-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added comment correctly', async () => {
            // Arrange
            const addComment = new Comment({
                content: 'dicoding',
                threadId: 'thread-123',
                username: 'user-123',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);
            await ThreadsTableTestHelper.addThread({ id: addComment.threadId });

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(addComment);

            // Assert
            expect(addedComment).toStrictEqual({
                id: 'comment-123',
                content: 'dicoding',
                owner: addComment.username
            });
        });
    });

    describe('getComment', () => {
        it('should throw InvariantError when comment not found', async () => {
            // Arrange
            const userRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(userRepositoryPostgres.getComment('thread-123', 'comment-123'))
                .rejects
                .toThrowError(InvariantError);
        });

        it('should return user id correctly', async () => {
            // Arrange
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });
            const userRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            const userId = await userRepositoryPostgres.getComment('thread-123', 'comment-123');

            // Assert
            expect(userId).toStrictEqual(new Comment({
                id: 'comment-123',
                username: 'dicoding',
                content: 'Dicoding Indonesia',
                threadId: 'thread-123'
            }));
        });
    });

    describe('deleteComment', () => {
        it('should delete comment from database', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
            const commentId = 'comment-123';
            const threadId = 'thread-123';
            const username = 'dicoding'
            await CommentsTableTestHelper.addComment({ id: commentId, thread_id: threadId, username });

            // Action
            await commentRepositoryPostgres.deleteComment(threadId, commentId, username);

            // Assert
            const comments = await CommentsTableTestHelper.getComment(threadId, commentId);
            expect(comments).toHaveLength(0);
        });
    });
});