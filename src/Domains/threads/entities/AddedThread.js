class AddedThread {
    constructor(payload) {
        this._verifyPayload(payload)

        const { title, owner, id = '' } = payload;

        this.owner = owner
        this.title = title;
        this.id = id
    }

    _verifyPayload({ title, id, owner }) {
        if (!title || !id || !owner) {
            throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof id !== 'string' || typeof owner !== 'string') {
            throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = AddedThread;
