const Thread = require('../../../threads/entities/Thread');
const Comment = require("../../../comments/entities/Comment");

describe('a Thread entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            title: 'abc',
            body: 'abc',
        };

        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            title: 123,
            body: 'aabc',
            username: 'abcd'
        };
        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should throw error when body contains less than 50 character', () => {
        // Arrange
        const payload = {
            title: 'dicoding indonesia',
            body: 'dicodingindonesiadicodingindonesiadicoding',
            username: 'user-123',
        };
        // Action and Assert
        expect(() => new Thread(payload)).toThrowError('THREAD.BODY_MINIMUM_CHAR');
    });

    it('should create thread object correctly', () => {
        // Arrange
        const payload = {
            title: 'dicoding',
            body: 'dicodingindonesiadicodingindonesiadicodingdicodingindonesiadicodingindonesiadicoding',
            username: 'user-123',
        };
        // Action
        const { title, body, username } = new Thread(payload);
        // Assert
        expect(title).toEqual(payload.title);
        expect(body).toEqual(payload.body);
        expect(username).toEqual(payload.username);
    });

});