const AddThread = require('../../../Domains/threads/entities/AddThread');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const ThreadUseCase = require('../ThreadUseCase');

describe('AddThreadUseCase', () => {
    it('should orchestrating the add thread action correctly', async () => {
        // Arrange
        const userId = 'user-123';
        const payload = {
            title: 'dicoding',
            body: 'dicodingdicodingaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbcccccccccc',
        };
        const expectedThread = new AddedThread({
            id: 'thread-123',
            title: payload.title,
            owner: userId,
        });

        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.addThread = jest.fn()
            .mockImplementation(() => Promise.resolve(new AddedThread({
                id: 'thread-123',
                title: payload.title,
                owner: userId,
            })));

        /** creating use case instance */
        const getThreadUseCase = new ThreadUseCase({
            threadRepository: mockThreadRepository
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
        const expectedThread = {
            id:  'thread-123',
            body: 'aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbccccccccccccc',
            title: 'judul',
            date: 'date',
            userId: 'user-123'
        };


        /** creating dependency of use case */
        const mockThreadRepository = new ThreadRepository();

        /** mocking needed function */
        mockThreadRepository.getThreadById = jest.fn()
            .mockImplementation(() => Promise.resolve({
                id:  'thread-123',
                body: 'aaaaaaaaaaaaaaaaabbbbbbbbbbbbbbbbbbbbbbbbccccccccccccc',
                title: 'judul',
                date: 'date',
                userId: 'user-123'
            }));

        /** creating use case instance */
        const getThreadUseCase = new ThreadUseCase({
            threadRepository: mockThreadRepository
        });

        // Action
        const addedThread = await getThreadUseCase.getThread( 'thread-123');

        // Assert
        expect(addedThread).toStrictEqual(expectedThread);
        expect(mockThreadRepository.getThreadById).toBeCalledWith('thread-123');
    });
});
