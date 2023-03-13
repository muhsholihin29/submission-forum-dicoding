const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
    constructor({
                    threadRepository,
                    commentRepository,
                    replyRepository
                }) {
        this._threadRepository = threadRepository;
        this._commentRepository = commentRepository;
        this._replyRepository = replyRepository;
    }

    addThread(userId, useCasePayload) {
        const thread = new AddThread(useCasePayload);
        return this._threadRepository.addThread(userId, thread);
    }

    async getThread(threadId) {
        const thread = await this._threadRepository.getThreadById(threadId);
        const comments = await this._commentRepository.getCommentsByThreadId(threadId);
        comments.map(comment => {
            if (comment.is_delete) {
                comment.content = '**komentar telah dihapus**';
            }
            delete comment.is_delete;
        });
        await Promise.all(comments.map(async comment => {
            comment.replies = await this._replyRepository.getRepliesInCommentsThread(threadId, comment.id);
            comment.replies.map(reply => {
                if (reply.is_delete) {
                    reply.content = '**balasan telah dihapus**';
                }
                delete reply.is_delete;
            });
        }))

        return {
            ...thread,
            comments
        }
    }
}

module.exports = ThreadUseCase;
