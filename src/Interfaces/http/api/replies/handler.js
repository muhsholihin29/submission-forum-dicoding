const ReplyUseCase = require('../../../../Applications/use_case/ReplyUseCase');
const ThreadUseCase = require("../../../../Applications/use_case/ThreadUseCase");
const CommentUseCase = require("../../../../Applications/use_case/CommentUseCase");

class RepliesHandler {
    constructor(container) {
        this._container = container;
    }

    async postReplyHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const replyUseCase = this._container.getInstance(ReplyUseCase.name);
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        await threadUseCase.getThread(request.params.threadId);
        await commentUseCase.getComment(
            request.params.threadId,
            request.params.commentId
        );
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
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        await threadUseCase.getThread(request.params.threadId);
        await commentUseCase.getComment(
            request.params.threadId,
            request.params.commentId
        );
        await replyUseCase.getReply(
            request.params.threadId,
            request.params.commentId,
            request.params.replyId,
        );
        await replyUseCase.verifyReplyOwner(
            request.params.replyId,
            userId
        )
        await replyUseCase.deleteReply(
            request.params.replyId,
        );

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }

}

module.exports = RepliesHandler;
