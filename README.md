# hex-database-api

A REST-like node.js api to provide JSON data about cards, equipment, boosters, sets, etc. for the HEX TCG with data parsed from games files by **doc-x** for his [search engine](http://doc-x.net/hex/).
The information presented through this API about HEX is copyrighted by Cryptozoic Entertainment. This project is not produced, endorsed, supported, or affiliated with Cryptozoic Entertainment. All code and data compromising this API is provided without warranty.

## Installation

`npm install` (make sure you have node.js and npm installed)

## Migration

To run the migration you need a PostgreSQL database set up with credentials specified in `/config/env/development.js`, which is also the default environmental config if `NODE_ENV` is not set. Feel free to change them.

`knex migrate:latest` (assuming knex is globally installed)

## Fetch data

`node lib/updater/index.js` starts a script which actually does all the work in terms of updating the data for all cards, pieces of equipment, etc.

## Test
`npm test` runs a few unit and integration tests.

## Start API

Starts the API at `localhost:<port>` with `<port>` being 3000 as a default as specified in either `/config/default.js` or specific to your environment in `/config/env/<env-file>`

`npm start`
