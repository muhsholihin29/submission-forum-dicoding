class AddThread {
    constructor(payload) {
        this._verifyPayload(payload)

        const { title, body, username, id = '' } = payload;

        this.username = username
        this.title = title;
        this.body = body;
        this.id = id
    }

    _verifyPayload({ title, body, username }) {
        if (!title || !body || !username) {
            throw new Error('THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof title !== 'string' || typeof body !== 'string' || typeof username !== 'string') {
            throw new Error('THREAD.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }

        if (body.length < 10) {
            throw new Error('THREAD.BODY_MINIMUM_CHAR');
        }
    }
}

module.exports = AddThread;