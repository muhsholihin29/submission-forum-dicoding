class ReplyRepository {
    async addReply(comment) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getReply(threadId, commentId, replyId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyReplyOwner(replyId, userId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getRepliesInCommentsThread(threadId, commentId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async deleteReply(replyId) {
        throw new Error('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ReplyRepository;
