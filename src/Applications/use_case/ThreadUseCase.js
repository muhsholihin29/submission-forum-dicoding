const AddThread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    addThread(userId, useCasePayload) {
        const thread = new AddThread(useCasePayload);
        return this._threadRepository.addThread(userId, thread);
    }

    async getThread(threadId) {
        return await this._threadRepository.getThreadById(threadId);
    }
}

module.exports = ThreadUseCase;
