const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const Comment = require('../../../Domains/comments/entities/Comment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const ThreadsTableTestHelper = require("../../../../tests/ThreadsTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const AddComment = require("../../../Domains/comments/entities/AddComment");
const NotFoundError = require("../../../Commons/exceptions/NotFoundError");
const AuthorizationError = require("../../../Commons/exceptions/AuthorizationError");
const InvariantError = require("../../../Commons/exceptions/InvariantError");

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable()
        await UsersTableTestHelper.cleanTable();
    });

    afterAll(async () => {
        await pool.end();
    });

    describe('addComment function', () => {
        it('should persist add comment', async () => {
            // Arrange
            const addComment = new AddComment({
                content: 'dicoding',
                threadId: 'thread-123',
                userId: 'user-123',
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
            const addComment = new AddComment({
                content: 'dicoding',
                threadId: 'thread-123',
                userId: 'user-123',
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
                owner: addComment.userId
            });
        });
    });

    describe('getComment', () => {
        it('should throw NotFoundError when comment not found', async () => {
            // Arrange
            const userRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action & Assert
            await expect(userRepositoryPostgres.getComment('thread-123', 'comment-123'))
                .rejects
                .toThrowError(NotFoundError);
        });

        it('should return comments correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });
            const userRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            const comment = await userRepositoryPostgres.getComment('thread-123', 'comment-123');

            // Assert
            expect(comment).toStrictEqual(new Comment({
                id: 'comment-123',
                content: 'Dicoding Indonesia',
                date: "2023-01-01",
                username: 'dicoding'
            }));
        });
    });

    describe('getCommentsByThreadId', () => {

        it('should return comments correctly', async () => {
            // Arrange
            await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });
            const userRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

            // Action
            const comment = await userRepositoryPostgres.getCommentsByThreadId('thread-123');

            // Assert
            expect(comment).toStrictEqual([{
                id: 'comment-123',
                content: 'Dicoding Indonesia',
                date: "2023-01-01",
                username: 'dicoding',
                is_delete: false
            }]);
        });
    });

    describe('verifyCommentOwner', () => {
        it('should mismatch comment owner', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
            const commentId = 'comment-123';
            const threadId = 'thread-123';
            const userId = 'dicoding'
            await CommentsTableTestHelper.addComment({ id: commentId, thread_id: threadId, userId });

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, 'uuuu'))
                .rejects.toThrowError(AuthorizationError);
        });

        it('should return comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

            // Action & Assert
            await expect(commentRepositoryPostgres.verifyCommentOwner('comment-123', 'user-123'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should verify comment owner correctly', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
            const commentId = 'comment-123';
            const threadId = 'thread-123';
            const userId = 'dicoding'
            await CommentsTableTestHelper.addComment({ id: commentId, thread_id: threadId, userId });

            await expect(commentRepositoryPostgres.verifyCommentOwner(commentId, userId))
                .resolves
                .not.toThrow(AuthorizationError);
        });
    });

    describe('deleteComment', () => {
        it('should return comment not found', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);

            // Action & Assert
            await expect(commentRepositoryPostgres.deleteComment('thread-123', 'comment-123', 'user-123'))
                .rejects.toThrowError(NotFoundError);
        });

        it('should delete comment from database', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
            const commentId = 'comment-123';
            const threadId = 'thread-123';
            const userId = 'dicoding'
            await ThreadsTableTestHelper.addThread({ id: threadId });
            await CommentsTableTestHelper.addComment({ id: commentId, thread_id: threadId, userId });

            // Action
            await commentRepositoryPostgres.deleteComment(threadId, commentId, userId);

            // Assert
            const comments = await CommentsTableTestHelper.getComment(threadId, commentId);
            expect(comments).toHaveLength(0);
        });
    });
});
