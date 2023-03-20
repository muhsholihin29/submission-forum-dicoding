class ThreadRepository {
    async addThread(userId, thread) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async getThreadById(thread_id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }

    async verifyThreadAvailability(thread_id) {
        throw new Error('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    }
}

module.exports = ThreadRepository;
