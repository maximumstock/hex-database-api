'use strict';

/**
 * @file Exports an instance of an arbitrary database connection at once
 */

const knexConfig = require('../../knexfile');
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development']);

module.exports = knex;
