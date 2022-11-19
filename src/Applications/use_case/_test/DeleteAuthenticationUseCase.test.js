const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const DeleteAuthenticationUseCase = require('../DeleteAuthenticationUseCase');

describe('DeleteAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain refresh token', async () => {
        // Arrange
        const useCasePayload = {};
        const deleteAuthenticationUseCase = new DeleteAuthenticationUseCase({});

        // Action & Assert
        await expect(deleteAuthenticationUseCase.execute(useCasePayload))
            .rejects
            .toThrowError('DELETE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_REFRESH_TOKEN');
    });

});
