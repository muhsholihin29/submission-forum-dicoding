const Comment = require('../../../comments/entities/Comment');

describe('a Comment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'abc',
        };

        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 123,
            date: '2022-12-31T17:00:00.000Z',
            username: 'dicoding'
        };
        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly', () => {
        // Arrange
        const payload = {
            id: 'comment-123',
            content: 'content',
            date: '2022-12-31T17:00:00.000Z',
            username: 'dicoding'
        };
        // Action
        const { content, date, username} = new Comment(payload);
        // Assert
        expect(content).toEqual(payload.content);
        expect(date).toEqual(payload.date);
        expect(username).toEqual(payload.username);
    });
});
