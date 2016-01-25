'use strict';

/**
 * @file Exports a bunyan logger instance
 */

const bunyan = require('bunyan');
const logger = bunyan.createLogger({name: 'default'});

module.exports = logger;
