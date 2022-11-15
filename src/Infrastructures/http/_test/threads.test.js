const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");
const JwtTokenManager = require("../../security/JwtTokenManager");
const Jwt = require("@hapi/jwt");

describe('/threads endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
    });

    describe('when POST /threads', () => {
        it('should response 201 and persisted user', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });
            const requestPayload = {
                title: 'dicoding',
                body: 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia',
                accessToken: accessToken
            };
            // eslint-disable-next-line no-undef
            console.log('abc');
            const server = await createServer(container);
            console.log('cde');
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // console.log(response);
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(responseJson.status).toEqual('success');
            expect(response.statusCode).toEqual(201);
            expect(responseJson.data.addedUser).toBeDefined();
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });
            const requestPayload = {
                title: 'Dicoding Indonesia',
                accessToken: accessToken
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });
            const requestPayload = {
                title: ['dicoding'],
                body: 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia',
                accessToken: accessToken
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread baru karena tipe data tidak sesuai');
        });

        it('should response 400 when username more than 50 character', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ username: 'dicoding' });
            const requestPayload = {
                title: 'dicoding',
                body: 'secret',
                accessToken: accessToken
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads',
                payload: requestPayload,
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat thread karena karakter kurang dari 50');
        });

        it('should response 200 when get thread by id', async () => {
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            // Arrange
            const requestPayload = {
                title: 'dicoding',
                body: 'secret',
            };
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123'
            });

            // Assert

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });
});
