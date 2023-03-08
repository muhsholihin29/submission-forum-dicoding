const AddThread = require('../../../threads/entities/AddThread');
const AddedThread = require('../../../threads/entities/AddedThread');

describe('a Thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
        };

        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: 'aabc',
            userId: 'abcd'
        };
        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when body contains less than 50 character', () => {
        // Arrange
        const payload = {
            title: 'dicoding indonesia',
            body: 'dicoding',
            userId: 'user-123',
        };
        // Action and Assert
        expect(() => new AddThread(payload)).toThrowError('THREAD.BODY_MINIMUM_CHAR');
    });

    it('should create thread object correctly', () => {
        // Arrange
        const payload = {
            title: 'dicoding',
            id: 'thread-124',
            owner: 'user-123',
        };
        // Action
        const { title, id, owner } = new AddedThread(payload);
        // Assert
        expect(title).toEqual(payload.title);
        expect(id).toEqual(payload.id);
        expect(owner).toEqual(payload.owner);
    });

});
