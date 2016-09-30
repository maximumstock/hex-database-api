'use strict';

/**
 * @file Exports a bunyan logger instance
 */

const bunyan = require('bunyan');
const logger = bunyan.createLogger({
    name: 'default',
    streams: [{
        level: 'info',
        stream: process.stdout
    }, {
        level: 'error',
        stream: process.stderr
    }]

});

module.exports = logger;
