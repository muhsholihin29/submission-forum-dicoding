const ReplyRepository = require('../ReplyRepository');

describe('ReplyRepository interface', () => {
    it('should throw error when invoke abstract behavior', async () => {
        // Arrange
        const commentRepository = new ReplyRepository();

        // Action and Assert
        await expect(commentRepository.addReply({})).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.getReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.verifyReplyOwner('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.getRepliesInCommentsThread('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
        await expect(commentRepository.deleteReply('')).rejects.toThrowError('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    });
});
