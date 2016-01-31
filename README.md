# hex-database-api

A REST-like node.js api to provide JSON data about cards, equipment, boosters, sets, etc. for the HEX TCG with data parsed from games files by **doc-x** for his [search engine](http://doc-x.net/hex/).


## Installation

`npm install` (make sure you have node.js and npm installed)

## Migration

To run the migration you need a PostgreSQL database set up with credentials specified in `/config/env/development.js`. Feel free to change them.

`knex migrate:latest` (assuming knex is globally installed)

## Fetch data

`node lib/updater/index.js`

## Test
`npm test`

## Start API

Starts the API at `localhost:<port>` with `<port>` being 3000 as a default as specified in either `/config/default.js` or specific to your environment in `/config/env/<env-file>`

`npm start`
