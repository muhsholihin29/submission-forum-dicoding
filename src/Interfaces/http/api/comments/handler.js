const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');

class CommentsHandler {
    constructor(container) {
        this._container = container;
    }

    async postCommentHandler(request, h) {
        const {id: userId} = request.auth.credentials;

        request.payload.userId = userId;
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        request.payload.threadId = request.params.threadId
        const addedComment = await commentUseCase.addComment(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedComment,
            },
        });
        response.code(201);
        return response;
    }

    async getCommentHandler(request, h) {
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const comment = await commentUseCase.getComment(
            request.params.threadId,
            request.params.commentId
        );

        const response = h.response({
            status: 'success',
            data: {
                comment,
            },
        });
        response.code(200);
        return response;
    }

    async deleteCommentHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const commentUseCase = this._container.getInstance(CommentUseCase.name);

        await commentUseCase.deleteComment(
            request.params.threadId,
            request.params.commentId,
            userId
        );

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }

}

module.exports = CommentsHandler;
