const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const JwtTokenManager = require("../../security/JwtTokenManager");
const Jwt = require("@hapi/jwt");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe('/comments endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    afterEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    describe('when POST /comments', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const requestPayload = {
                content: 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia',
                username: 'dicoding'
            };
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            const server = await createServer(container);
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    'authorization': 'Bearer '+accessToken,
                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(201);
            expect(responseJson.status).toEqual('success');
            expect(responseJson.data.addedComment).toBeDefined();
        });

        it('should response 404 when thread not found', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const requestPayload = {
                content: 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia',
                username: 'dicoding'
            };
            await ThreadsTableTestHelper.addThread({ id: 'thread-1234' });

            const server = await createServer(container);
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    'authorization': 'Bearer '+accessToken,
                }
            });

            // console.log(response);
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(responseJson.status).toEqual('fail');
            expect(response.statusCode).toEqual(404);
        });

        it('should response 400 when request payload not contain needed property', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const server = await createServer(container);
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
                payload: {

                }
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const requestPayload = {
                content: ['Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia'],
            };
            const server = await createServer(container);
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments',
                payload: requestPayload,
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat komentar baru karena tipe data tidak sesuai');
        });


    });

    describe('when GET /comments', () => {
        it('should response 200 when get comment by id', async () => {
            // Arrange
            const server = await createServer(container);
            await UsersTableTestHelper.addUser({id: 'user-123'})
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'GET',
                url: '/threads/thread-123/comments/comment-123'
            });

            // Assert

            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });
    });

    describe('when DELETE /comment', () => {
        it('should response 200 correctly', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-1234' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 404 when comment not found', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-1234', thread_id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 403 when username not authorized', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123', userId: 'user-1234' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
        });

    });
});
