'use strict';

require('co-mocha');
const expect = require('chai').expect;
const app = require('../../../lib');
const request = require('co-supertest').agent(app.listen());


describe('/objects', function() {

    describe('GET /objects', function() {

        it('should return an array and 200 OK', function*() {

            const result = yield request.get('/v1/objects').expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');

        });

    });



    describe('POST /objects/search', function() {

        const SEARCH_ENDPOINT_URL = '/v1/objects/search';

        it('should return an array and 200 OK if the request body was ok', function*() {

            const result = yield request.post(SEARCH_ENDPOINT_URL).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');

        });

        it('should support searching by name with just a substring', function*() {

            let testName = 'Army';

            const result = yield request.post(SEARCH_ENDPOINT_URL).send({name: testName}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            // every returned object should have that name
            result.body.forEach(function(a) {
                expect(a.name.indexOf(testName)).to.not.equal(-1);
            });

        });

        it('should provide searching by sub_type', function*() {

            let testSubType = 'Vennen Warrior';

            const result = yield request.post(SEARCH_ENDPOINT_URL).send({'sub_type': testSubType}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            // every returned object should have that sub_type
            result.body.forEach(function(a) {
                expect(a.sub_type).to.equal(testSubType);
            });

        });

        it('should support searching by faction', function*() {

            let testFaction = 'Aria';

            const result = yield request.post(SEARCH_ENDPOINT_URL).send({faction: testFaction}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            // every returned object should have that faction
            result.body.forEach(function(a) {
                expect(a.faction).to.equal(testFaction);
            });

        });

        it('should support searching by rarity', function*() {

            let testRarity = 'Legendary';

            const result = yield request.post(SEARCH_ENDPOINT_URL).send({rarity: testRarity}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            // every returned object should have that rarity
            result.body.forEach(function(a) {
                expect(a.rarity).to.equal(testRarity);
            });

        });

        it('should support searching by set_number', function*() {

            let testSetNumber = '001';

            const result = yield request.post(SEARCH_ENDPOINT_URL).send({'set_number': testSetNumber}).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            // every returned object should have that set_number
            result.body.forEach(function(a) {
                expect(a.set_number).to.equal(testSetNumber);
            });

        });

        it('should support searching by atk/health/socket_count/cost with a range using lt/gt', function*() {

            let payload = {
                atk: {
                    lt: 5,
                    gt: 3
                }
            };

            const result = yield request.post(SEARCH_ENDPOINT_URL).send(payload).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            result.body.forEach(function(a) {
                expect(a.atk > payload.atk.gt).to.equal(true);
                expect(a.atk < payload.atk.lt).to.equal(true);
            });

        });

        it('should support searching by atk/health/socket_count/cost with a range using lte/gte', function*() {

            let payload = {
                atk: {
                    lte: 5,
                    gte: 3
                }
            };

            const result = yield request.post(SEARCH_ENDPOINT_URL).send(payload).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            result.body.forEach(function(a) {
                expect(a.atk >= payload.atk.gte).to.equal(true);
                expect(a.atk <= payload.atk.lte).to.equal(true);
            });

        });

        it('should support searching by atk/health/socket_count/cost with a range using lt/gte or lte/gt', function*() {

            let payload = {
                atk: {
                    lte: 5,
                    gt: 3
                }
            };

            const result = yield request.post(SEARCH_ENDPOINT_URL).send(payload).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            result.body.forEach(function(a) {
                expect(a.atk > payload.atk.gt).to.equal(true);
                expect(a.atk <= payload.atk.lte).to.equal(true);
            });

        });

        it('should yield an empty array if specifying an invalid range with lt/gt/lte/gte', function*() {

            let payload = {
                atk: {
                    lt: 5,
                    gt: 7
                }
            };

            const result = yield request.post(SEARCH_ENDPOINT_URL).send(payload).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.equal(0);

        });

        it('should support searching by type by providing an array of strings', function*() {

            let payload = {
                type: ['Artifact', 'Troop']
            };

            const result = yield request.post(SEARCH_ENDPOINT_URL).send(payload).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            result.body.forEach(function(a) {
                payload.type.forEach(function(t) {
                    expect(a.type.indexOf(t)).to.not.equal(-1);
                });
            });

        });

        it('should support searching by color by providing an array of strings', function*() {

            let payload = {
                color: ['Ruby', 'Diamond']
            };

            const result = yield request.post(SEARCH_ENDPOINT_URL).send(payload).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            result.body.forEach(function(a) {
                payload.color.forEach(function(t) {
                    expect(a.color.indexOf(t)).to.not.equal(-1);
                });
            });

        });

        it('should support searching by color/threshold by providing an array of objects', function*() {

            let payload = {
                threshold: [{
                    shard: 'Diamond',
                    quantity: 2
                }, {
                    shard: 'Ruby',
                    quantity: 2
                }]
            };

            const result = yield request.post(SEARCH_ENDPOINT_URL).send(payload).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();
            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

            result.body.forEach(function(a) {
                payload.threshold.forEach(function(t) {
                    expect(JSON.stringify(a.threshold).indexOf(JSON.stringify(t))).to.not.equal(-1); // a bit dirty but should yield the correct value
                });
            });

        });

    });


    describe('GET /objects/property/:property', function() {

        it('should yield a non-empty array of all possible values for that property', function*() {

            let testProperty = 'faction';

            const result = yield request.get(`/v1/objects/properties/${testProperty}`).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();

            expect(result.body).to.be.an('array');
            expect(result.body.length).to.not.equal(0);

        });

        it('should yield an empty array if the property does not exist', function*() {

            let testProperty = 'doesnotexist';

            const result = yield request.get(`/v1/objects/properties/${testProperty}`).expect('Content-Type', 'application/json; charset=utf-8').expect(200).end();

            expect(result.body).to.be.an('array');
            expect(result.body.length).to.equal(0);

        });

    });

});
