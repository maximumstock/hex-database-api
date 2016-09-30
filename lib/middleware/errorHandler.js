'use strict';

/**
 * @file Exports a basic error handler middleware for koa
 */

const logger = require('../logger');

module.exports = function() {

    return function* errorHandler(next) {

        try {
            yield next;
        } catch (err) {

            logger.error(err);

            this.status = err.status || 500;
            this.body = {
                status: this.status,
                msg: err.message
            };

            // include error with stacktrace; similiar to express error handler
            if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
                this.body.err = err;
            }

        }

    }


}
