'use strict';

const config = require('./config');

const knexConfig = {
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

module.exports = {

    development: knexConfig,
    staging: knexConfig,
    production: knexConfig

};
