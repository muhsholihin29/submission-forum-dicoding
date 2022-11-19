const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const Comment = require('../../../Domains/comments/entities/Comment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');
const AuthenticationRepositoryPostgres = require("../AuthenticationRepositoryPostgres");
const AuthenticationsTableTestHelper = require("../../../../tests/AuthenticationsTableTestHelper");

describe('CommentRepositoryPostgres', () => {
    afterEach(async () => {
        await CommentsTableTestHelper.cleanTable();
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

            // Action
            await userRepositoryPostgres.addComment(addComment);

            // Assert
            const threads = await CommentsTableTestHelper.getComment('comment-123');
            expect(threads).toHaveLength(1);
        });

        it('should return added user correctly', async () => {
            // Arrange
            const addComment = new Comment({
                content: 'dicoding',
                threadId: 'thread-123',
                username: 'user-123',
            });
            const fakeIdGenerator = () => '123'; // stub!
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

            // Action
            const addedComment = await commentRepositoryPostgres.addComment(addComment);

            // Assert
            expect(addedComment).toStrictEqual(new Comment({
                id: 'comment-123',
                content: 'dicoding',
                threadId: 'thread-123',
                username: addComment.username
            }));
        });
    });

    describe('deleteComment', () => {
        it('should delete comment from database', async () => {
            // Arrange
            const commentRepositoryPostgres = new CommentRepositoryPostgres(pool);
            const commentId = 'comment-123';
            await CommentsTableTestHelper.addComment({ id: commentId });

            // Action
            await commentRepositoryPostgres.deleteComment(commentId);

            // Assert
            const comments = await CommentsTableTestHelper.getComment(commentId);
            expect(comments).toHaveLength(0);
        });
    });
});