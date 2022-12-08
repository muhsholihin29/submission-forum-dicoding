const Thread = require('../../Domains/threads/entities/AddThread');

class ThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    addThread(useCasePayload) {
        const thread = new Thread(useCasePayload);
        return this._threadRepository.addThread(thread);
    }

    async getThread(thread_id) {
        return await this._threadRepository.getThread(thread_id);
    }
}

module.exports = ThreadUseCase;