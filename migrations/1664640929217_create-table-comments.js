/* eslint-disable camelcase */
exports.up = (pgm) => {
    pgm.createTable('comments', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        thread_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        user_id: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'DATE',
            notNull: true,
        },
        is_delete: {
            type: 'BOOLEAN',
            notNull: true,
        },
    });
};

exports.down = (pgm) => {
    pgm.dropTable('comments');
};
