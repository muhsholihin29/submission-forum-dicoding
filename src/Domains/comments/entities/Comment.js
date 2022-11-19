class Comment {
    constructor(payload) {
        this._verifyPayload(payload)

        const { content, threadId, username } = payload

        this.content = content;
        this.threadId = threadId;
        this.username = username;
    }

    _verifyPayload({ content, threadId, username }) {
        if (!content || !threadId || !username) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof threadId !== 'string' || typeof username !== 'string') {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Comment;