const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const CommentUseCase = require('../../../../Applications/use_case/CommentUseCase');
const ReplyUseCase = require("../../../../Applications/use_case/ReplyUseCase");

class ThreadsHandler {
    constructor(container) {
        this._container = container;
    }

    async postThreadHandler(request, h) {
        const {id: userId} = request.auth.credentials;
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const addedThread = await threadUseCase.addThread(userId, request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedThread,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadHandler(request, h) {
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const commentUseCase = this._container.getInstance(CommentUseCase.name);
        const replyUseCase = this._container.getInstance(ReplyUseCase.name);
        const thread = await threadUseCase.getThread(request.params.id);
        const comments = await commentUseCase.getCommentsByThreadId(request.params.id);
        await Promise.all(comments.map(async comment => {
            comment.replies = await replyUseCase.getRepliesInCommentsThread(request.params.id, comment.id)
        }))
        const response = h.response({
            status: 'success',
            data: {
                thread: {
                    ...thread,
                    comments
                },
            },
        });
        response.code(200);
        return response;
    }

}

module.exports = ThreadsHandler;
