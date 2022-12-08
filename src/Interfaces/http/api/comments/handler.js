const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');
const ValidateAuthenticationUsecase = require('../../../../Applications/use_case/ValidateAuthenticationUsecase');

class CommentsHandler {
    constructor(container) {
        this._container = container;

        this.postCommentHandler = this.postCommentHandler.bind(this);
        this.getCommentHandler = this.getCommentHandler.bind(this);
        this.deleteCommentHandler = this.deleteCommentHandler.bind(this);
    }

    async postCommentHandler(request, h) {
        const validateAuthenticationUsecase = this._container.getInstance(ValidateAuthenticationUsecase.name);
        const validationData = await validateAuthenticationUsecase.execute(request.headers);
        request.payload.username = validationData.username;
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
            request.params.threadId || 0,
            request.params.commentId || 0
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
        const validateAuthenticationUsecase = this._container.getInstance(ValidateAuthenticationUsecase.name);
        const validationData = await validateAuthenticationUsecase.execute(request.headers);
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        await commentUseCase.deleteComment(
            request.params.threadId,
            request.params.commentId,
            validationData.username
        );

        const response = h.response({
            status: 'success',
        });
        response.code(200);
        return response;
    }

}

module.exports = CommentsHandler;