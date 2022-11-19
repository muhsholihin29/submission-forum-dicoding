const Comment = require('../../Domains/comments/entities/Comment');

class CommentUseCase {
    constructor({ commentRepository }) {
        this._commentRepository = commentRepository;
    }

    addComment(useCasePayload) {
        const comment = new Comment(useCasePayload);
        return this._commentRepository.addComment(comment);
    }

    getComment(comment_id) {
        return this._commentRepository.getComment(comment_id);
    }

    async deleteComment(comment_id) {
        return await this._commentRepository.deleteComment(comment_id);
    }
}

module.exports = CommentUseCase;