const routes = (handler) => ([
    {
        method: 'POST',
        path: '/threads/{threadId}/comments',
        handler: (request, h) => handler.postCommentHandler(request, h),
        options: {
            auth: 'forum_jwt',
        },
    },
    {
        method: 'GET',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: (request, h) => handler.getCommentHandler(request, h),
    },
    {
        method: 'DELETE',
        path: '/threads/{threadId}/comments/{commentId}',
        handler: (request, h) => handler.deleteCommentHandler(request, h),
        options: {
            auth: 'forum_jwt',
        },
    }
]);

module.exports = routes;
