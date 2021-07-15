# hex-database-api

*NOTE: The [HEX TCG](https://en.wikipedia.org/wiki/Hex:_Shards_of_Fate) was shut down, so is this project.*

---

A REST-like node.js api to provide JSON data about cards, equipment, boosters, sets, etc. for the HEX TCG with data parsed from games files by doc-x for his [search engine](http://doc-x.net/hex/).

---

The information presented through this API about HEX is copyrighted by Cryptozoic Entertainment. This project is not produced, endorsed, supported, or affiliated with Cryptozoic Entertainment. All code and data compromising this API is provided without warranty.

This API serves static JSON data like names, sets, rarities and more for most of the cards, pieces of equipment, champions, mercenaries and everything else the game files include at that time. It is updated daily by parsing search results from doc-x' search engine, which you can find [here](http://doc-x.net/hex/).

As most of the time this API does not differentiate between cards and other types of things, the term 'objects' is used instead.
So whenever 'objects' are referenced in this documentation, it can be either a card, an item, a piece of equipment, etc.

- [API documentation](DOCS.md)

## Installation

`npm install` (make sure you have node.js and npm installed)

## Migration

To run the migration you need a PostgreSQL database set up with credentials specified in `/config/env/development.js`, which is also the default environmental config if `NODE_ENV` is not set. Feel free to change them.

`knex migrate:latest` (assuming knex is globally installed)

## Fetch data

`npm run update` starts a script which actually does all the work in terms of updating the data for all cards, pieces of equipment, etc.

## Test

`npm test` runs a few unit and integration tests.

## Start API

Starts the API at `localhost:<port>` with `<port>` being 3000 as a default as specified in either `/config/default.js` or specific to your environment in `/config/env/<env-file>`

`npm start`
