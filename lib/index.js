'use strict';

/**
 * @file Exports the application
 */

const koa = require('koa');
const body = require('koa-body');
const compress = require('koa-compress');
const logger = require('koa-logger');

const middleware = require('./middleware');
const errorHandler = middleware.errorHandler;
const notFoundHandler = middleware.notFoundHandler;

const app = koa();

app.use(errorHandler());
app.use(notFoundHandler());
app.use(logger());
app.use(body());
app.use(compress());

require('./routes')(app);

module.exports = app;
