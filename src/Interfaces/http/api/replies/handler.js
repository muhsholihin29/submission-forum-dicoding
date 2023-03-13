const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');

class RepliesHandler {
    constructor(container) {
        this._container = container;
    }

    async postReplyHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const replyUseCase = this._container.getInstance(ReplyUseCase.name);
        const addedReply = await replyUseCase.addReply(
            userId,
            request.params.threadId,
            request.params.commentId,
            request.payload.content);

        const response = h.response({
            status: 'success',
            data: {
                addedReply,
            },
        });
        response.code(201);
        return response;
    }

    async deleteReplyHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const replyUseCase = this._container.getInstance(ReplyUseCase.name);

        await replyUseCase.deleteReply(
            request.params.threadId,
            request.params.commentId,
            request.params.replyId,
            userId
        );

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }

}

module.exports = RepliesHandler;
