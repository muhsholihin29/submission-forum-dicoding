const Thread = require('../../Domains/threads/entities/Thread');

class ThreadUseCase {
    constructor({ threadRepository }) {
        this._threadRepository = threadRepository;
    }

    addThread(useCasePayload) {
        const thread = new Thread(useCasePayload);
        return this._threadRepository.addThread(thread);
    }

    getThread(thread_id) {
        return this._threadRepository.getThread(thread_id);
    }
}

module.exports = ThreadUseCase;