const ThreadUseCase = require('../../../../Applications/use_case/ThreadUseCase');
const ValidateAuthenticationUsecase = require('../../../../Applications/use_case/ValidateAuthenticationUsecase');

class ThreadsHandler {
    constructor(container) {
        this._container = container;

        this.postThreadHandler = this.postThreadHandler.bind(this);
        this.getThreadHandler = this.getThreadHandler.bind(this);
    }

    async postThreadHandler(request, h) {
        try {
            const validateAuthenticationUsecase = this._container.getInstance(ValidateAuthenticationUsecase.name);
            const threadUseCase = this._container.getInstance(ThreadUseCase.name);
            const validationData = await validateAuthenticationUsecase.execute(request.headers);
            request.payload.username = validationData.username;
            const addedThread = await threadUseCase.addThread(request.payload);

            const response = h.response({
                status: 'success',
                data: {
                    addedThread,
                },
            });
            response.code(201);
            return response;
        }
        catch (e) {
            console.log(e)
            return e
        }
    }

    async getThreadHandler(request, h) {
        const threadUseCase = this._container.getInstance(ThreadUseCase.name);
        const thread = await threadUseCase.getThread(
            request.params.id
        );

        const response = h.response({
            status: 'success',
            data: {
                thread,
            },
        });
        response.code(200);
        return response;
    }

}

module.exports = ThreadsHandler;