const AddComment = require('../entities/AddComment');

describe('a AddComment entities', () => {
    it('should throw error when payload did not contain needed property', () => {
        // Arrange
        const payload = {
            content: 'dicoding',
        };

        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when payload did not meet data type specification', () => {
        // Arrange
        const payload = {
            content: 123456,
            threadId: 'thread-123',
            userId: 'user-123',
        };
        // Action and Assert
        expect(() => new AddComment(payload)).toThrowError('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should create comment object correctly', () => {
        // Arrange
        const payload = {
            content: 'dicoding',
            threadId: 'thread-123',
            userId: 'user-123',
        };
        // Action
        const { content, threadId, userId} = new AddComment(payload);
        // Assert
        expect(content).toEqual(payload.content);
        expect(threadId).toEqual(payload.threadId);
        expect(userId).toEqual(payload.userId);
    });
});
