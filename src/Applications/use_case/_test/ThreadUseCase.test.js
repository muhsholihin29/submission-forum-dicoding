const Thread = require('../../../Domains/threads/entities/Thread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const PasswordHash = require('../../security/PasswordHash');
const ThreadUseCase = require('../ThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            title: 'dicoding',
            body: 'dicodingdicodingaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccc',
            username: 'user-123',
        };
        const expectedThread = new Thread({
            id: 'thread-123',
            title: useCasePayload.title,
            body: useCasePayload.body,
            username: useCasePayload.username,
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedThread));

        /** creating use case instance */
        const getThreadUseCase = new ThreadUseCase({
            threadRepository: mockThreadRepository
        });

        // Action
        const registeredThread = await getThreadUseCase.addThread(useCasePayload);

        // Assert
        expect(registeredThread).toStrictEqual(expectedThread);
        expect(mockThreadRepository.addThread).toBeCalledWith(new Thread({
            title: useCasePayload.title,
            body: useCasePayload.body,
            username: useCasePayload.username
        }));
    });
});

describe('GetThreadUseCase', () => {
    it('should orchestrating the get thread action correctly', async () => {
        // Arrange
        const useCasePayload = {
            id: 'thread-123',
        };
        const expectedThread = new Thread({
            id: useCasePayload.id,
            body: 'aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbccccccccccccc',
            title: 'judul',
            username: 'user-123'
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.verifyAvailableThreadname = jest.fn()
            .mockImplementation(() => Promise.resolve());
        mockThreadRepository.getThread = jest.fn()
            .mockImplementation(() => Promise.resolve(expectedThread));

        /** creating use case instance */
        const getThreadUseCase = new ThreadUseCase({
            threadRepository: mockThreadRepository
        });

        // Action
        const registeredThread = await getThreadUseCase.getThread(useCasePayload);

        // Assert
        expect(registeredThread).toStrictEqual(expectedThread);
        expect(mockThreadRepository.getThread).toBeCalledWith({
            id: 'thread-123'
        });
    });
});
