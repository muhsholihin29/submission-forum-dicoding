const AuthenticationError = require("../../Commons/exceptions/AuthenticationError");

class ValidateAuthenticationUsecase {
    constructor({
                    authenticationTokenManager,
                }) {
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(headers) {
        this._verifyPayload(headers);
        const { authorization } = headers;

        return  await this._authenticationTokenManager.decodePayload(authorization.split(' ')[1]);
    }

    _verifyPayload(headers) {
        const { authorization } = headers;

        if (!authorization){
            throw new AuthenticationError('Missing authentication');
        }
        if (typeof authorization !== 'string') {
            throw new AuthenticationError('Missing authentication');
        }
        if (authorization.split(' ').length !== 2){
            throw new AuthenticationError('Missing authentication');
        }
        if (authorization.split(' ')[0] === 'Bearer') {} else {
            throw new AuthenticationError('Missing authentication');
        }
    }
}

module.exports = ValidateAuthenticationUsecase;
