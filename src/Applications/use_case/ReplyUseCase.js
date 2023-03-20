const Reply = require('../../Domains/replies/entities/Reply');

class ReplyUseCase {
    constructor({
                    threadRepository,
                    commentRepository,
                    replyRepository
                }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    async addReply(owner, threadId, commentId, content) {
        const reply = new Reply({owner, threadId, commentId, content});
        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.getComment(threadId, commentId);
        return this._replyRepository.addReply(reply);
    }

    async deleteReply(threadId, commentId, replyId, userId) {
        this._validateString(threadId);
        this._validateString(commentId);
        this._validateString(replyId);
        await this._threadRepository.verifyThreadAvailability(threadId);
        await this._commentRepository.getComment(threadId, commentId);
        await this._replyRepository.getReply(threadId, commentId, replyId,);
        await this._replyRepository.verifyReplyOwner(replyId, userId)
        return this._replyRepository.deleteReply(replyId);
    }

    _validateString(text) {
        if (!text) {
            throw new Error('REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof text !== 'string') {
            throw new Error('REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ReplyUseCase;
