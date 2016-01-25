'use strict';

/**
 * @file Exports a configuration object based on NODE_ENV
 */

const defaultConfig = require('./default');


/**
 * @file Builds a configuration object from the default configuration and the relevant environment-specific configuration
 */
module.exports = function buildConfig() {

    const environment = process.env.NODE_ENV || 'development'; // default 'development'

    const config = defaultConfig;
    let envConfig = {};

    switch (environment.toLowerCase()) {

        case 'development':
            envConfig = require('./env/development');
            break;
        case 'staging':
            envConfig = require('./env/staging');
            break;
        case 'production':
            envConfig = require('./env/production');
            break;
        default:
            throw new Error('Unbekannte Umgebungskonfiguration');

    }

    for (let prop in envConfig) {
        config[prop] = envConfig[prop];
    }

    return config;

}();
