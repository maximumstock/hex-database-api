'use strict';

/**
 * @file Test specifications for configuration building
 */

require('co-mocha');
const expect = require('chai').expect;
const requireNew = require('require-new');

/**
 * @function helper function to validate basic configuration properties
 */
function checkConfig(config) {

    expect(config).to.have.a.property('port');
    expect(config).to.have.a.property('environment');

}

describe('Config', function() {

    // reset `NODE_ENV` after each test
    afterEach(function(done) {
        if (process.env.NODE_ENV) {
            delete process.env.NODE_ENV;
        }
        done();
    });

    describe('Environment `development`', function() {

        it('should yield proper configuration', function*() {

            process.env.NODE_ENV = 'development';
            const config = requireNew('../../../config');

            checkConfig(config);
            expect(config.environment).to.equal('development');

        });

    });

    describe('Environment `staging`', function() {

        it('should yield proper configuration', function*() {

            process.env.NODE_ENV = 'staging';
            process.env.PORT = 'dummyport';
            process.env.DBUSER = 'dummyuser';
            process.env.DBPASS = 'dummypass';
            process.env.DBHOST = 'dummyhost';
            process.env.DBNAME = 'dummyname';
            const config = requireNew('../../../config');

            checkConfig(config);
            expect(config.environment).to.equal('staging');

        });

        it('should yield an error if necessary parameters are missing', function*() {

            process.env.NODE_ENV = 'staging';

            try {
              requireNew('../../../lib/config');
            } catch(e) {
              expect(e).to.be.an('error');
            }

        });

    });

    describe('Environment `production`', function() {

        it('should yield proper configuration', function*() {

            process.env.NODE_ENV = 'production';
            process.env.PORT = 'dummyport';
            process.env.DBUSER = 'dummyuser';
            process.env.DBPASS = 'dummypass';
            process.env.DBHOST = 'dummyhost';
            process.env.DBNAME = 'dummyname';
            const config = requireNew('../../../config');

            checkConfig(config);
            expect(config.environment).to.equal('production');

        });

        it('should yield an error if necessary parameters are missing', function*() {

            process.env.NODE_ENV = 'production';

            try {
              requireNew('../../../lib/config');
            } catch(e) {
              expect(e).to.be.an('error');
            }

        });

    });

    describe('Invalid environment', function() {

        it('should yield an error', function*() {

            process.env.NODE_ENV = 'invalid...';

            try {
                requireNew('../../../config');
            } catch (e) {
                expect(e).to.be.an('error');
            }

        });



    });

    describe('Missing environment spec', function() {

        it('should yield `development` configuration', function(done) {

            const config = requireNew('../../../config');

            checkConfig(config);
            expect(config.environment).to.equal('development');

            done();

        });

    });

});
