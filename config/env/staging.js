'use strict';

/**
 * @file Exports a configuration object specific to environment 'staging'
 */

if (!process.env.PORT)  {
    throw new Error('process.env.PORT not provided');
}
if (!process.env.DBHOST)  {
    throw new Error('process.env.PORT not provided');
}
if (!process.env.DBNAME)  {
    throw new Error('process.env.PORT not provided');
}
if (!process.env.DBUSER)  {
    throw new Error('process.env.PORT not provided');
}
if (!process.env.DBPASS)  {
    throw new Error('process.env.PORT not provided');
}

module.exports = {

    port: process.env.PORT,
    dbhost: process.env.DBHOST,
    dbname: process.env.DBNAME,
    dbuser: process.env.DBUSER,
    dbpass: process.env.DBPASS

};
