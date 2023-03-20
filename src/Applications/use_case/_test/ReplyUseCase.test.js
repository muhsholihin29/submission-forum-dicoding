const Reply = require('../../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyUseCase = require('../ReplyUseCase');
const ThreadRepository = require("../../../Domains/threads/ThreadRepository");
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const Comment = require("../../../Domains/comments/entities/Comment");

describe('AddCUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const data = {
            content: 'dicoding',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        const expectedReply = {
            id: 'comment-123',
            content: data.content,
            owner: data.owner,
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getComment = jest.fn()
            .mockImplementation(() => Promise.resolve(new Comment({
                id: 'comment-123',
                content: 'content',
                date: '2023-01-01',
                username: 'dicoding',
            })));
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'comment-123',
                content: data.content,
                owner: data.owner,
            }));

        /** creating use case instance */
        const getReplyUseCase = new ReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository,
        });

        // Action
        const registeredReply = await getReplyUseCase.addReply(data.owner, data.threadId, data.commentId, data.content);

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
        expect(mockCommentRepository.getComment).toBeCalledWith('thread-123','comment-123');
        expect(registeredReply).toStrictEqual(expectedReply);
        expect(mockReplyRepository.addReply).toBeCalledWith(new Reply({
            content: data.content,
            threadId: data.threadId,
            commentId: data.commentId,
            owner: data.owner,
        }));
    });

    it('should throw error if use case payload empty', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** creating use case instance */
        const commentUseCase = new ReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        // Action & Assert
        await expect(commentUseCase.addReply())
            .rejects
            .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error if add use case payload id not string', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** creating use case instance */
        const replyUseCase = new ReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        // Action & Assert
        await expect(replyUseCase.addReply(1, 6, 1, 'hehe'))
            .rejects
            .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error if delete use case payload is not string', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** creating use case instance */
        const replyUseCase = new ReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        // Action & Assert
        await expect(replyUseCase.deleteReply(1, 6, 1, 'hehe'))
            .rejects
            .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});

describe('Delete ReplyUseCase', () => {

    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.verifyThreadAvailability = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockCommentRepository.getComment = jest.fn()
            .mockImplementation(() => Promise.resolve(new Comment({
                id: 'comment-123',
                content: 'content',
                date: '2023-01-01',
                username: 'dicoding',
            })));
        mockReplyRepository.getReply = jest.fn()
            .mockImplementation(() => Promise.resolve(new Reply({
                id: 'reply-123',
                owner: 'user-123',
                content: 'Dicoding Indonesia',
                commentId: 'comment-123',
                threadId: 'thread-123'
            })));
        mockReplyRepository.verifyReplyOwner = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new ReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        // Action
        await commentUseCase.deleteReply('thread-123', 'comment-123', 'reply-123', 'user-123')

        // Assert
        expect(mockThreadRepository.verifyThreadAvailability).toBeCalledWith('thread-123');
        expect(mockCommentRepository.getComment).toBeCalledWith('thread-123','comment-123');
        expect(mockReplyRepository.getReply).toBeCalledWith('thread-123','comment-123', 'reply-123');
        expect(mockReplyRepository.verifyReplyOwner).toBeCalledWith('reply-123', 'user-123');
        expect(mockReplyRepository.deleteReply).toBeCalledWith('reply-123');
    });

    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new ReplyUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        // Action & Assert
        await expect(commentUseCase.deleteReply())
            .rejects
            .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });
});
