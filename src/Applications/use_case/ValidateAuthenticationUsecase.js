class ValidateAuthenticationUsecase {
    constructor({
                    authenticationTokenManager,
                }) {
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);
        const { access_token } = useCasePayload;

        return  await this._authenticationTokenManager.decodePayload(access_token);
    }

    _verifyPayload(payload) {
        const { access_token } = payload;

        if (!access_token) {
            throw new Error('VALIDATE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
        }

        if (typeof access_token !== 'string') {
            throw new Error('VALIDATE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ValidateAuthenticationUsecase;
