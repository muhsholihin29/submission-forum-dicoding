const Reply = require('../../Domains/replies/entities/Reply');

class ReplyUseCase {
    constructor({replyRepository}) {
        this._replyRepository = replyRepository;
    }

    addReply(owner, threadId, commentId, content) {
        const reply = new Reply({owner, threadId, commentId, content});
        return this._replyRepository.addReply(reply);
    }

    async getReply(threadId, commentId, replyId) {
        this._validateString(threadId);
        this._validateString(commentId);
        this._validateString(replyId);
        return this._replyRepository.getReply(threadId, commentId, replyId);
    }

    async getRepliesInCommentsThread(threadId, commentId) {
        this._validateString(threadId);
        this._validateString(commentId);
        return this._replyRepository.getRepliesInCommentsThread(threadId, commentId);
    }

    async verifyReplyOwner(replyId, userId) {
        this._validateString(replyId)
        this._validateString(userId)
        return this._replyRepository.verifyReplyOwner(replyId, userId)
    }

    async deleteReply(replyId) {
        this._validateString(replyId);
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
