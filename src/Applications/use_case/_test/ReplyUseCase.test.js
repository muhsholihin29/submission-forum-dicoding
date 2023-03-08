const Reply = require('../../../Domains/replies/entities/Reply');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const ReplyUseCase = require('../ReplyUseCase');

describe('AddCUseCase', () => {
    it('should orchestrating the add comment action correctly', async () => {
        // Arrange
        const data = {
            content: 'dicoding',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        };
        const expectedReply = new Reply({
            id: 'comment-123',
            content: data.content,
            threadId: data.threadId,
            commentId: data.commentId,
            owner: data.owner,
        });

        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockReplyRepository.addReply = jest.fn()
            .mockImplementation(() => Promise.resolve(new Reply({
                id: 'comment-123',
                content: data.content,
                threadId: data.threadId,
                commentId: data.commentId,
                owner: data.owner,
            })));

        /** creating use case instance */
        const getReplyUseCase = new ReplyUseCase({
            replyRepository: mockReplyRepository
        });

        // Action
        const registeredReply = await getReplyUseCase.addReply(data.owner, data.threadId, data.commentId, data.content);

        // Assert
        expect(registeredReply).toStrictEqual(expectedReply);
        expect(mockReplyRepository.addReply).toBeCalledWith(new Reply({
            content: data.content,
            threadId: data.threadId,
            commentId: data.commentId,
            owner: data.owner,
        }));
    });

    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();

        /** creating use case instance */
        const commentUseCase = new ReplyUseCase({
            replyRepository: mockReplyRepository
        });

        // Action & Assert
        await expect(commentUseCase.getReply())
            .rejects
            .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error if use case payload id not string', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();

        /** creating use case instance */
        const replyUseCase = new ReplyUseCase({
            replyRepository: mockReplyRepository
        });

        // Action & Assert
        await expect(replyUseCase.getReply(1, 6, 1))
            .rejects
            .toThrowError('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });
});

describe('GetReplyUseCase', () => {
    it('should orchestrating the get comment action correctly', async () => {
        // Arrange
        const expectedReply = new Reply({
            id: 'reply-123',
            content: 'dicoding',
            threadId: 'thread-123',
            commentId: 'comment-123',
            owner: 'user-123',
        });

        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockReplyRepository.getReply = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedReply));

        /** creating use case instance */
        const getReplyUseCase = new ReplyUseCase({
            replyRepository: mockReplyRepository
        });

        // Action
        const getReply = await getReplyUseCase.getReply('thread-123','comment-123', 'reply-123');

        // Assert
        expect(getReply).toStrictEqual(expectedReply);
        expect(mockReplyRepository.getReply).toBeCalledWith('thread-123','comment-123', 'reply-123');
    });
});

describe('Delete ReplyUseCase', () => {

    it('should orchestrating the delete comment action correctly', async () => {
        // Arrange

        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new ReplyUseCase({
            replyRepository: mockReplyRepository
        });

        // Action
        await expect(commentUseCase.deleteReply('reply-123'))

        // Assert
        expect(mockReplyRepository.deleteReply).toBeCalledWith('reply-123');
    });

    it('should throw error if use case payload not contain id', async () => {
        // Arrange
        /** creating dependency of use case */
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockReplyRepository.deleteReply = jest.fn()
            .mockImplementation(() => Promise.resolve());

        /** creating use case instance */
        const commentUseCase = new ReplyUseCase({
            replyRepository: mockReplyRepository
        });

        // Action & Assert
        await expect(commentUseCase.deleteReply())
            .rejects
            .toThrowError('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });
});
