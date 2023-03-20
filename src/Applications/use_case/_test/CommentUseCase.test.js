const Comment = require('../../../Domains/comments/entities/Comment');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const CommentUseCase = require('../CommentUseCase');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");

describe('AddCUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const useCasePayload = {
            content: 'dicoding',
            threadId: 'thread-123',
            userId: 'user-123',
        };
        const expectedComment = {
            id: 'comment-123',
            content: useCasePayload.content,
            owner: useCasePayload.userId,
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.addComment = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'comment-123',
                content: useCasePayload.content,
                owner: useCasePayload.userId,
            }));

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        });

        // Action
        const addedComment = await commentUseCase.addComment(useCasePayload);

        // Assert
        expect(addedComment).toStrictEqual(expectedComment);
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123')
        expect(mockCommentRepository.addComment).toBeCalledWith({
            content: 'dicoding',
            threadId: 'thread-123',
            userId: 'user-123',
        });
    });

    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            threadRepository: mockThreadRepository,
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
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            threadRepository: mockThreadRepository,
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
            content: 'content',
            date: '2023-01-01',
            username: 'dicoding',
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.getComment = jest.fn()
            .mockImplementation(() => Promise.resolve(new Comment({
                id: 'comment-123',
                content: 'content',
                date: '2023-01-01',
                username: 'dicoding',
            })));

        /** creating use case instance */
        const getCommentUseCase = new CommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        });



        // Action
        const addedComment = await getCommentUseCase.getComment('thread-123','comment-123');

        // Assert
        expect(addedComment).toStrictEqual(expectedComment);
        expect(mockCommentRepository.getComment).toBeCalledWith('thread-123','comment-123');
    });
});

describe('Delete CommentUseCase', () => {

    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.verifyCommentOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getComment = jest.fn()
            .mockImplementation(() => Promise.resolve(new Comment({
                id: 'comment-123',
                content: 'content',
                date: '2023-01-01',
                username: 'dicoding',
            })));
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        });

        // Action
        await commentUseCase.deleteComment('thread-123', 'comment-123', 'dicoding')

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
        expect(mockCommentRepository.verifyCommentOwner).toBeCalledWith('comment-123', 'dicoding');
        expect(mockCommentRepository.getComment).toBeCalledWith('thread-123','comment-123');
        expect(mockCommentRepository.deleteComment).toBeCalledWith('thread-123','comment-123', 'dicoding');
    });

    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();

        /** mocking needed function */
        mockCommentRepository.deleteComment = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new CommentUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository
        });

        // Action & Assert
        await expect(commentUseCase.deleteComment())
            .rejects
            .toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
});
