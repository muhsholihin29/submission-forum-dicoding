const AuthenticationRepository = require('../../../Domains/authentications/AuthenticationRepository');
const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const ValidateAuthenticationUsecase = require('../ValidateAuthenticationUsecase');

describe('ValidateAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain access token', async () => {
        // Arrange
        const useCasePayload = {};
        const validateAuthenticationUsecase = new ValidateAuthenticationUsecase({});

        // Action & Assert
        await expect(validateAuthenticationUsecase.execute(useCasePayload))
            .rejects
            .toThrowError('VALIDATE_AUTHENTICATION_USE_CASE.NOT_CONTAIN_ACCESS_TOKEN');
    });

    it('should throw error if access token not string', async () => {
        // Arrange
        const useCasePayload = {
            accessToken: 1,
        };
        const validateAuthenticationUsecase = new ValidateAuthenticationUsecase({});

        // Action & Assert
        await expect(validateAuthenticationUsecase.execute(useCasePayload))
            .rejects
            .toThrowError('VALIDATE_AUTHENTICATION_USE_CASE.PAYLOAD_NOT_MEET_DATA_TYPE_SPECIFICATION');
    });

    it('should orchestrating the validation authentication action correctly', async () => {
        // Arrange
        const useCasePayload = {
            accessToken: 'some_refresh_token',
        };

        const mockAuthenticationTokenManager = new AuthenticationTokenManager();
        // Mocking
        mockAuthenticationTokenManager.decodePayload = jest.fn()
            .mockImplementation(() => Promise.resolve({username: 'dicoding', id: 'user-123'}));
        // Create the use case instace
        const validateAuthenticationUsecase = new ValidateAuthenticationUsecase({
            authenticationTokenManager: mockAuthenticationTokenManager,
        });

        // Action
        const accessToken = await validateAuthenticationUsecase.execute(useCasePayload);

        // Assert

        expect(mockAuthenticationTokenManager.decodePayload)
            .toBeCalledWith(useCasePayload.accessToken);
        expect(accessToken).toEqual(JSON.parse('{"id": "user-123", "username": "dicoding"}'));
    });
});
