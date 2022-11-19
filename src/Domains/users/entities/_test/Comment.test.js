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
            threadId: 'thread-123',
            username: 'user-123'
        };
        // Action and Assert
        expect(() => new Comment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly', () => {
        // Arrange
        const payload = {
            content: 'dicoding',
            threadId: 'thread-123',
            username: 'user-123'
        };
        // Action
        const { content, threadId, username} = new Comment(payload);
        // Assert
        expect(content).toEqual(payload.content);
        expect(threadId).toEqual(payload.threadId);
        expect(username).toEqual(payload.username);
    });
});