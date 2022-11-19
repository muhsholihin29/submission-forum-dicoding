const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../CommentUseCase');

describe('AddCUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'dicoding',
            threadId: 'thread-123',
            username: 'user-123',
        };
        const expectedComment = new Comment({
            id: 'comment-123',
            content: useCasePayload.content,
            threadId: useCasePayload.threadId,
            username: useCasePayload.username,
        });

        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedComment));

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action
        const registeredComment = await getCommentUseCase.addComment(useCasePayload);

        // Assert
        expect(registeredComment).toStrictEqual(expectedComment);
        expect(mockCommentRepository.addComment).toBeCalledWith(new Comment({
            content: useCasePayload.content,
            threadId: useCasePayload.threadId,
            username: useCasePayload.username
        }));
    });
});

describe('GetCommentUseCase', () => {
    it('should orchestrating the get comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'comment-123',
        };
        const expectedComment = new Comment({
            id: useCasePayload.id,
            content: 'dicoding',
            threadId: 'thread-123',
            username: 'user-123',
        });

        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.verifyAvailableCommentname = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedComment));

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action
        const registeredComment = await getCommentUseCase.getComment(useCasePayload);

        // Assert
        expect(registeredComment).toStrictEqual(expectedComment);
        expect(mockCommentRepository.getComment).toBeCalledWith({
            id: 'comment-123'
        });
    });
});

describe('Delete CommentUseCase', () => {
    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        const useCasePayload = 666;
        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        await mockCommentRepository.deleteComment() = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action & Assert
        await expect(commentUseCase.deleteComment('comment-123'))
            .rejects
            .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    });
});