'use strict';

const config = require('./config');

module.exports = {

    client: 'postgresql',
    connection: {
        database: config.dbname,
        user: config.dbuser,
        password: config.dbpass
    },
    pool: {
        min: 2,
        max: 10
    }

};
