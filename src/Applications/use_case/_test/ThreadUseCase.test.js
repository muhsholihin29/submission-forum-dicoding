const AddThread = require('../../../Domains/threads/entities/AddThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');
const CommentRepository = require("../../../Domains/comments/CommentRepository");
const ReplyRepository = require("../../../Domains/replies/ReplyRepository");
const Comment = require("../../../Domains/comments/entities/Comment");
const Reply = require("../../../Domains/replies/entities/Reply");

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const userId = 'user-123';
        const payload = {
            title: 'dicoding',
            body: 'dicodingdicodingaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccc',
        };
        const expectedThread = {
            id: 'thread-123',
            title: payload.title,
            owner: userId,
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'thread-123',
                title: payload.title,
                owner: userId,
            }));

        /** creating use case instance */
        const getThreadUseCase = new ThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        // Action
        const addedThread = await getThreadUseCase.addThread(userId, payload);

        // Assert
        expect(addedThread).toStrictEqual(expectedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(userId, new AddThread({
            title: payload.title,
            body: payload.body,
        }));
    });
});

describe('GetThreadUseCase', () => {
    it('should orchestrating the get thread action correctly', async () => {
        // Arrange
        const expectedReply = [
            {
                id: 'reply-123',
                content: '**balasan telah dihapus**',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            },
            {
                id: 'reply-123',
                content: 'sebuah balasan',
                threadId: 'thread-123',
                commentId: 'comment-123',
                owner: 'user-123',
            }];
        const expectedComment = {
            id: 'comment-123',
            content: '**komentar telah dihapus**',
            date: '2023-01-01',
            username: 'dicoding',
            replies: expectedReply,
        };
        const expectedThread = {
            id: 'thread-123',
            body: 'aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbccccccccccccc',
            title: 'judul',
            date: '2023-01-01',
            username: 'user',
            comments: [expectedComment]
        };

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();
        const mockCommentRepository = new CommentRepository();
        const mockReplyRepository = new ReplyRepository();

        /** mocking needed function */
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id: 'thread-123',
                body: 'aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbccccccccccccc',
                title: 'judul',
                date: '2023-01-01',
                username: 'user'
            }));
        mockCommentRepository.getCommentsByThreadId = jest.fn()
            .mockImplementation(() => Promise.resolve([{
                id: 'comment-123',
                content: 'content',
                date: '2023-01-01',
                username: 'dicoding',
                is_delete: true
            }]));
        mockReplyRepository.getRepliesInCommentsThread = jest.fn()
            .mockImplementation(() => Promise.resolve([
                {
                    id: 'reply-123',
                    content: 'sebuah balasan',
                    threadId: 'thread-123',
                    commentId: 'comment-123',
                    owner: 'user-123',
                    is_delete: true
                },
                {
                    id: 'reply-123',
                    content: 'sebuah balasan',
                    threadId: 'thread-123',
                    commentId: 'comment-123',
                    owner: 'user-123',
                    is_delete: false
                }]));

        /** creating use case instance */
        const getThreadUseCase = new ThreadUseCase({
            threadRepository: mockThreadRepository,
            commentRepository: mockCommentRepository,
            replyRepository: mockReplyRepository
        });

        // Action
        const addedThread = await getThreadUseCase.getThread('thread-123');

        // Assert
        expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
        expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith('thread-123');
        expect(mockReplyRepository.getRepliesInCommentsThread).toBeCalledWith('thread-123', 'comment-123');
        expect(addedThread).toStrictEqual(expectedThread);
        expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    });
});
