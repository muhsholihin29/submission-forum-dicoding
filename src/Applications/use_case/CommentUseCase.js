const AddComment = require("../../Domains/comments/entities/AddComment");

class CommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    addComment(useCasePayload) {
        const comment = new AddComment(useCasePayload);
        return this._commentRepository.addComment(comment);
    }

    async getCommentsByThreadId(threadId) {
        this._validateString(threadId);
        return this._commentRepository.getCommentsByThreadId(threadId);
    }

    async getComment(threadId, commentId) {
        this._validateString(threadId);
        this._validateString(commentId);
        return this._commentRepository.getComment(threadId, commentId);
    }

    async verifyCommentOwner(commentId, userId) {
        this._validateString(commentId);
        this._validateString(userId);
        return this._commentRepository.verifyCommentOwner(commentId, userId);
    }

    async deleteComment(threadId, commentId, userId) {
        this._validateString(threadId);
        this._validateString(commentId);
        this._validateString(userId);
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
