'use strict';

require('co-mocha');
const expect = require('chai').expect;
const app = require('../../lib');
const request = require('co-supertest').agent(app.listen());


describe('/objects', function() {

    describe('GET /objects', function() {

        it('should return an array and 200 OK', function*() {

            const result = yield request.get('/v1/objects').expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');

        });

    });



    describe('POST /objects/search', function() {

        it('should return an array and 200 OK if the request body was ok', function*() {

            const result = yield request.post('/v1/objects/search').expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');

        });

        it('should support searching by name with just a substring', function*() {

            let testName = 'Army';

            const result = yield request.post('/v1/objects/search').send({name: testName}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');

            // every returned object should have that name
            for(let i = 0; i < result.body; i++) {
                expect(result.body[i].name.indexOf(testName)).not.to.equal(-1);
            }

        });

    });

})
