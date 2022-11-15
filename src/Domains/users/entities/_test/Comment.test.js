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
            content: 123,
            access_token: 'abcd'
        };
        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly', () => {
        // Arrange
        const payload = {
            content: 'dicoding',
            access_token: 'Dicoding Indonesia',
        };
        // Action
        const { content, access_token} = new Comment(payload);
        // Assert
        expect(content).toEqual(payload.content);
        expect(access_token).toEqual(payload.access_token);
    });
});