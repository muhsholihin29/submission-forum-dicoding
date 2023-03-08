const pool = require('../../database/postgres/pool');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');
const JwtTokenManager = require("../../security/JwtTokenManager");
const Jwt = require("@hapi/jwt");
const RepliesTableTestHelper = require("../../../../tests/RepliesTableTestHelper");
const UsersTableTestHelper = require("../../../../tests/UsersTableTestHelper");

describe('../replies endpoint', () => {
    afterAll(async () => {
        await pool.end();
    });

    beforeEach(async () => {
        await UsersTableTestHelper.cleanTable();
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    afterEach(async () => {
        await ThreadsTableTestHelper.cleanTable();
        await CommentsTableTestHelper.cleanTable();
        await RepliesTableTestHelper.cleanTable();
    });

    describe('when POST .../replies', () => {
        it('should response 201 and persisted comment', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const requestPayload = {
                content: 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia',
            };
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id:  'thread-123'});

            const server = await createServer(container);
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    'authorization': 'Bearer '+accessToken,
                }
            });

            // console.log(response);
            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(responseJson.status).toEqual('success');
            expect(response.statusCode).toEqual(201);
            expect(responseJson.data.addedReply).toBeDefined();
        });

        it('should response 400 when thread not found', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const requestPayload = {
                content: 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia',
            };

            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id:  'thread-123'});

            const server = await createServer(container);
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
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

        it('should response 404 when comment not found', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const requestPayload = {
                content: 'Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia',
            };
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });

            const server = await createServer(container);
            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
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
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
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
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena properti yang dibutuhkan tidak ada');
        });

        it('should response 400 when request payload not meet data type specification', async () => {
            // Arrange
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            const requestPayload = {
                content: ['Dicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding IndonesiaDicoding Indonesia'],
            };
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });
            const server = await createServer(container);

            // Action
            const response = await server.inject({
                method: 'POST',
                url: '/threads/thread-123/comments/comment-123/replies',
                payload: requestPayload,
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(400);
            expect(responseJson.status).toEqual('fail');
            expect(responseJson.message).toEqual('tidak dapat membuat balasan baru karena tipe data tidak sesuai');
        });


    });

    describe('when DELETE /replies', () => {
        it('should response 200 correctly', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });
            await RepliesTableTestHelper.addReply({ id: 'reply-123', comment_id: 'comment-123', thread_id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(200);
            expect(responseJson.status).toEqual('success');
        });

        it('should response 403 when owner not authorized', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await UsersTableTestHelper.addUser({ id: 'user-123' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });
            await RepliesTableTestHelper.addReply({ id: 'reply-123', comment_id: 'comment-123', thread_id: 'thread-123', owner: 'john doe' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(403);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 404 when thread not found', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-1234' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });
            await RepliesTableTestHelper.addReply({ id: 'reply-123', comment_id: 'comment-123', thread_id: 'thread-123', owner: 'john doe' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
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
            await RepliesTableTestHelper.addReply({ id: 'reply-123', comment_id: 'comment-123', thread_id: 'thread-123', owner: 'john doe' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });

        it('should response 404 when reply not found', async () => {
            // Arrange
            const server = await createServer(container);
            const jwtTokenManager = new JwtTokenManager(Jwt.token);
            const accessToken = await jwtTokenManager.createAccessToken({ id: 'user-123', username: 'dicoding' });
            await ThreadsTableTestHelper.addThread({ id: 'thread-123' });
            await CommentsTableTestHelper.addComment({ id: 'comment-123', thread_id: 'thread-123' });

            // Action
            const response = await server.inject({
                method: 'DELETE',
                url: '/threads/thread-123/comments/comment-123/replies/reply-123',
                headers: {
                    'authorization': 'Bearer '+accessToken,
                },
            });

            // Assert
            const responseJson = JSON.parse(response.payload);
            expect(response.statusCode).toEqual(404);
            expect(responseJson.status).toEqual('fail');
        });
    });
});
