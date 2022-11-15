const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const ValidateAuthenticationUsecase = require('../../../../Applications/use_case/ValidateAuthenticationUsecase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadHandler = this.getThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        const validateAuthenticationUsecase = this._container.getInstance(ValidateAuthenticationUsecase.name);
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const validationData = await validateAuthenticationUsecase.execute(request.payload);
        request.payload.username = validationData.username || undefined;
        console.log('mytag3 ' + request.payload.username)
        const addedUser = await threadUseCase.addThread(request.payload);

        const response = h.response({
            status: 'success',
            data: {
                addedUser,
            },
        });
        response.code(201);
        return response;
    }

    async getThreadHandler(request, h) {
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const addedUser = await threadUseCase.getThread(
            request.params.id
        );

        const response = h.response({
            status: 'success',
            data: {
                addedUser,
            },
        });
        response.code(200);
        return response;
    }

}

module.exports = ThreadsHandler;