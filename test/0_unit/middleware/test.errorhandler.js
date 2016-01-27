'use strict';

/**
 * @file Test specification for error handling middleware
 */

require('co-mocha');
const expect = require('chai').expect;
const koa = require('koa');
const request = require('co-supertest');

const middleware = require('../../../lib/middleware');
const errorHandler = middleware.errorHandler;

describe('Error Handler', function() {

    it('should return a thrown error as a json object', function*() {

        const app = koa();
        app.use(errorHandler());
        app.use(function*(next) {
            const err = new Error('very important error');
            err.status = 401;
            throw err;
        });

        const result = yield request(app.listen()).get('/').expect(401).end();

        expect(result.body).to.be.an('object');
        expect(result.body).to.have.a.property('status');
        expect(result.body).to.have.a.property('msg');
        expect(result.body).to.have.a.property('err');
        expect(result.body.status).to.equal(401);

    });

    it('should not provide stacktrace information when not in development mode', function*() {

        process.env.NODE_ENV = 'production';

        const app = koa();
        app.use(errorHandler());
        app.use(function*(next) {
            const err = new Error('very important error');
            err.status = 401;
            throw err;
        });

        const result = yield request(app.listen()).get('/').expect(401).end();

        expect(result.body).to.be.an('object');
        expect(result.body).to.have.a.property('status');
        expect(result.body).to.have.a.property('msg');
        expect(result.body).to.not.have.a.property('err');
        expect(result.body.status).to.equal(401);

        process.env.NODE_ENV = null;

    });

});
