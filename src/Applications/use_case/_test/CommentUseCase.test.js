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

    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action & Assert
        await expect(commentUseCase.getComment())
            .rejects
            .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error if use case payload id not string', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action & Assert
        await expect(commentUseCase.getComment(1, 6))
            .rejects
            .toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});

describe('GetCommentUseCase', () => {
    it('should orchestrating the get comment action correctly', async () => {
        // Arrange
        const expectedComment = new Comment({
            id: 'comment-123',
            content: 'dicoding',
            threadId: 'thread-123',
            username: 'user-123',
        });

        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.getComment = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedComment));

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action
        const registeredComment = await getCommentUseCase.getComment('thread-123','comment-123');

        // Assert
        expect(registeredComment).toStrictEqual(expectedComment);
        expect(mockCommentRepository.getComment).toBeCalledWith('thread-123','comment-123');
    });
});

describe('Delete CommentUseCase', () => {

    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action
        await expect(commentUseCase.deleteComment('thread-123', 'comment-123', 'dicoding'))

        // Assert
        expect(mockCommentRepository.deleteComment).toBeCalledWith('thread-123','comment-123', 'dicoding');
    });

    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            commentRepository: mockCommentRepository
        });

        // Action & Assert
        await expect(commentUseCase.deleteComment())
            .rejects
            .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
});