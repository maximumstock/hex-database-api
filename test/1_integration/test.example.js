'use strict';

require('co-mocha');
const expect = require('chai').expect;
const app = require('../../lib');
const request = require('co-supertest').agent(app.listen());


describe('integration test', function() {

    it('should do something', function*() {

        expect(true);

    });

})
