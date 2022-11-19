class ValidateAuthenticationUsecase {
    constructor({
                    authenticationTokenManager,
                }) {
        this._authenticationTokenManager = authenticationTokenManager;
    }

    async execute(useCasePayload) {
        this._verifyPayload(useCasePayload);
        const { accessToken } = useCasePayload;

        return  await this._authenticationTokenManager.decodePayload(accessToken);
    }

    _verifyPayload(payload) {
        const { accessToken } = payload;

        if (!accessToken) {
            throw new Error('VALIDATE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
        }

        if (typeof accessToken !== 'string') {
            throw new Error('VALIDATE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
        }
    }
}

module.exports = ValidateAuthenticationUsecase;
