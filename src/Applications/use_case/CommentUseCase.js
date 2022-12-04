const Comment = require('../../Domains/comments/entities/Comment');

class CommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    addComment(useCasePayload) {
        const comment = new Comment(useCasePayload);
        return this._commentRepository.addComment(comment);
    }

    async getComment(threadId, commentId) {
        this._verifyId(threadId, commentId);
        return this._commentRepository.getComment(threadId, commentId);
    }

    async deleteComment(threadId, commentId, username) {
        this._verifyId(threadId, commentId, username)
        return this._commentRepository.deleteComment(threadId, commentId, username);
    }

    _verifyId(threadId, commentId) {
        if (!threadId || !commentId) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof commentId !== 'string' || typeof threadId !== 'string') {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }

}

module.exports = CommentUseCase;