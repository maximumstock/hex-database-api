'use strict';

/**
 * @file Exports all routes at once
 */

const v1 = require('./v1');

module.exports = function(app) {

    app.use(v1.routes());

};
