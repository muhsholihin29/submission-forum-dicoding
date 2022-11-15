class Comment {
    constructor(payload) {
        this._verifyPayload(payload)

        const { content, access_token } = payload

        this.content = content;
        this.access_token = access_token;
    }

    _verifyPayload({ content, access_token }) {
        if (!content || !access_token) {
            throw new Error('COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
        }

        if (typeof content !== 'string' || typeof access_token !== 'string') {
            throw new Error('COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = Comment;