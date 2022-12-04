const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: handler.postCommentHandler,
    },
    {
        method: 'GET',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.getCommentHandler,
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: handler.deleteCommentHandler,
    }
]);

module.exports = routes;
