const AddComment = require("../../Domains/comments/entities/AddComment");

class CommentUseCase {
    constructor({ threadRepository, commentRepository }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
    }

    async addComment(useCasePayload) {
        const comment = new AddComment(useCasePayload);
        await this._threadRepository.verifyThreadAvailability(comment.threadId);
        return this._commentRepository.addComment(comment);
    }

    async getComment(threadId, commentId) {
        this._validateString(threadId);
        this._validateString(commentId);
        return this._commentRepository.getComment(threadId, commentId);
    }

    async deleteComment(threadId, commentId, userId) {
        this._validateString(threadId);
        this._validateString(commentId);
        this._validateString(userId);
        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.verifyCommentOwner(commentId, userId);
        await this._commentRepository.getComment(threadId, commentId);
        return this._commentRepository.deleteComment(threadId, commentId, userId);
    }

    _validateString(text) {
        if (!text) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof text !== 'string') {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = CommentUseCase;
