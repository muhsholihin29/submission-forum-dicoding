const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');

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
        const thread = await threadUseCase.getThread(request.params.id);
        const response = h.response({
            status: 'success',
            data: {
                thread
            },
        });
        response.code(200);
        return response;
    }

}

module.exports = ThreadsHandler;
