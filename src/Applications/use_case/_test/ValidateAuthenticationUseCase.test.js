const AuthenticationTokenManager = require('../../security/AuthenticationTokenManager');
const ValidateAuthenticationUsecase = require('../ValidateAuthenticationUsecase');
const AuthenticationError = require("../../../Commons/exceptions/AuthenticationError");

describe('ValidateAuthenticationUseCase', () => {
    it('should throw error if use case payload not contain access token', async () => {
        // Arrange
        const headers = {};
        const validateAuthenticationUsecase = new ValidateAuthenticationUsecase({});

        // Action & Assert
        await expect(validateAuthenticationUsecase.execute(headers))
            .rejects
            .toThrow(AuthenticationError);
    });

    it('should throw error if access token not string', async () => {
        // Arrange
        const headers = {
            authorization: 1,
        };
        const validateAuthenticationUsecase = new ValidateAuthenticationUsecase({});

        // Action & Assert
        await expect(validateAuthenticationUsecase.execute(headers))
            .rejects
            .toThrow(AuthenticationError);
    });

    it('should throw error if access token not contain bearer', async () => {
        // Arrange
        const headers = {
            authorization: 'access token',
        };
        const validateAuthenticationUsecase = new ValidateAuthenticationUsecase({});

        // Action & Assert
        await expect(validateAuthenticationUsecase.execute(headers))
            .rejects
            .toThrow(AuthenticationError);
    });

    it('should throw error if access token not valid', async () => {
        // Arrange
        const headers = {
            authorization: 'Bearer',
        };
        const validateAuthenticationUsecase = new ValidateAuthenticationUsecase({});

        // Action & Assert
        await expect(validateAuthenticationUsecase.execute(headers))
            .rejects
            .toThrow(AuthenticationError);
    });

    it('should orchestrating the validation authentication action correctly', async () => {
        // Arrange
        const headers = {
            authorization: 'Bearer some_refresh_token',
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
        const data = await validateAuthenticationUsecase.execute(headers);

        // Assert

        expect(mockAuthenticationTokenManager.decodePayload)
            .toBeCalledWith(headers.authorization.split(' ')[1]);
        expect(data).toEqual(JSON.parse('{"id": "user-123", "username": "dicoding"}'));
    });
});
