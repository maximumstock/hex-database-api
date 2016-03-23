'use strict';

/**
 * @file Entry file that starts the server
 */

const app = require('./lib');
const config = require('./config');

app.listen(config.port, function(err) {
    if(err) {
        throw err;
    }
    console.info('hex-database-api running on', config.port);
});
