'use strict';

/**
 * @file Exports a standalone module that requests new data from `config.api`, parses it and inserts it into the database
 */

const config = require('../../config');
const logger = require('../logger');

const request = require('request');
const cheerio = require('cheerio');
const knex = require('../db');
const async = require('async');
const _ = require('lodash');

// List of table header names from doc-x' table_html version that shall be copied
const HEADERS_TO_COPY = [
    'SET NUMBER',
    'NAME',
    'RARITY',
    'COLOR',
    'TYPE',
    'SUB TYPE',
    'FACTION',
    'SOCKET COUNT',
    'COST',
    'THRESHOLD',
    'ATK',
    'HEALTH',
    'TEXT',
    'UUID'
];

// Description of how to map column names from HEADERS_TO_COPY to the database
const HEADER_MAP = {
    'SET NUMBER': {
        name: 'set_number',
        type: 'string'
    },
    'NAME': {
        name: 'name',
        type: 'string'
    },
    'RARITY': {
        name: 'rarity',
        type: 'string'
    },
    'COLOR': {
        name: 'color',
        type: 'string'
    },
    'TYPE': {
        name: 'type',
        type: 'string'
    },
    'SUB TYPE': {
        name: 'sub_type',
        type: 'string'
    },
    'FACTION': {
        name: 'faction',
        type: 'string'
    },
    'SOCKET COUNT': {
        name: 'socket_count',
        type: 'int'
    },
    'COST': {
        name: 'cost',
        type: 'int'
    },
    'THRESHOLD': {
        name: 'threshold',
        type: 'string'
    },
    'ATK': {
        name: 'atk',
        type: 'int'
    },
    'HEALTH': {
        name: 'health',
        type: 'int'
    },
    'TEXT': {
        name: 'text',
        type: 'string'
    },
    'UUID': {
        name: 'uuid',
        type: 'string'
    },
};

module.exports = {

    /**
     * @function Requests and parses doc-x data
     */
    findAndParse: function startUpdate() {

        return new Promise(function(resolve, reject) {

            const options = {
                headers: {
                    'content-type': 'application/json'
                },
                url: config.apiUrl,
                method: 'POST',
                json: {
                    'output_form': 'html_table'
                }
            };

            request(options, function(err, res, body) {

                if (err) {
                    return reject(err);
                }

                if (res.statusCode !== 200) {
                    console.log(res.statusCode, body);
                    const err = new Error('Something went wrong requesting new data');
                    err.status = res.statusCode;
                    return reject(err);
                }

                const $ = cheerio.load(body, {
                    normalizeWhitespace: true
                });

                const headers = [];
                $('div.CSSTableGenerator tr:first-child td').each(function(i, elem) {
                    headers.push($(this).text());
                });

                const rows = [];
                $('div.CSSTableGenerator tr:first-child').nextAll().each(function(i, elem) {
                    let cols = [];
                    $(this).find('td').each(function(i, elem) {
                        if($(this).children().length !== 0) {
                            let html = $(this).html();
                            // remove `<p></p>` instances that were meant to create line breaks
                            html = html.split('<p></p>').join('').trim();
                            cols.push(html);
                        } else {
                            cols.push($(this).text().trim());
                        }
                    })
                    rows.push(cols);
                });

                const dataToInsert = [];
                rows.forEach(function(r) {

                    let record = {}; // record to fill properties into; will be pushed onto `dataToInsert`

                    // for every element of the array of property values
                    for (let i = 0; i < r.length; i++) {
                        // if the index doesn't point to a value in `HEADERS_TO_COPY`, don't bother
                        if (HEADERS_TO_COPY.indexOf(headers[i]) === -1) {
                            continue;
                        }
                        // else check if the property needs to be mapped
                        let propertyName = headers[i]; // old header column name as a default
                        // if index the currently old header value is in `HEADER_MAP`, then map it
                        if (HEADER_MAP.hasOwnProperty(headers[i])) {
                            propertyName = HEADER_MAP[headers[i]].name;

                            if (HEADER_MAP[headers[i]].type === 'int') {
                                r[i] = parseInt(r[i]);
                            }

                            // special threshold parsing for dem boyz
                            if (headers[i] === 'THRESHOLD') {

                                if (r[i].length === 0) {
                                    r[i] = []; // if there is no threshold => empty array
                                } else {

                                    const subThresholds = r[i].trim().split(',');
                                    let thresholds = []; // array to attach later back to r[i]
                                    subThresholds.forEach(function(st) {
                                        let i = st.trim().split(' '); // '1 Diamond' => ['1', 'Diamond']
                                        thresholds.push({
                                            shard: i[1],
                                            quantity: parseInt(i[0])
                                        });
                                    });
                                    // also sort array of objects by name of shard
                                    _.sortBy(subThresholds, 'shard');
                                    r[i] = thresholds;
                                }

                            }

                            // special color parsing for dem boyz
                            if (headers[i] === 'COLOR') {

                                if (r[i].length === 0) {
                                    r[i] = []; // if there is no color => empty array
                                } else {
                                    // split color string into parts and then trim them and feed them back as a sorted array
                                    r[i] = r[i].trim().split(',').map(function(color) {
                                        return color.trim();
                                    }).sort();
                                }

                            }

                            // special type parsing for dem boyz
                            if(headers[i] === 'TYPE') {
                                r[i] = r[i].trim().split(',').map(function(type) {
                                    return type.trim();
                                }).sort();
                            }

                        }
                        // assign property:value to record
                        record[propertyName] = r[i];
                    }

                    dataToInsert.push(record);

                });

                return resolve(dataToInsert);

            });

        });


    },


    /**
     * @function Updates the database
     * @param {array} objects - An array of JSON objects to store
     */
    startUpdate: function saveObjects(objects) {

        return new Promise(function(resolve, reject) {

            objects = objects.map(function(o) {
                return {
                    data: o
                };
            });

            const funcArray = [];

            objects.forEach(function(obj) {
                funcArray.push(function(_callback) {
                    module.exports.writeSingle(obj, _callback);
                });
            });

            async.parallelLimit(funcArray, 25, function(errors, results) {
                if(errors) {
                    return reject(errors);
                } else {
                    // sum up how many objects were actually inserted
                    let newObjectsInserted = 0;
                    results.forEach(function(r) {
                        if(r !== true) {
                            newObjectsInserted++;
                        }
                    });
                    return resolve(newObjectsInserted);
                }
            })

        });

    },

    /**
     * @function Saves one entry to the database
     * @param {object} obj - One dataset of an object
     */
    writeSingle: function writeSingle(obj, cb) {

        // check if object already exists in the database based on `uuid`
        knex.raw('SELECT * FROM objects WHERE data->>\'uuid\' = ? LIMIT 1', [obj.data.uuid]).asCallback(function(error, result) {
            if(error) {
                return cb(error, null);
            }
            if(result.rows.length !== 0) {
                // already exists
                return cb(null, true);
            } else {
                logger.info(`Inserting ${obj.data.name}, ${obj.data.rarity}`);
                return knex('objects').insert(obj).asCallback(cb);
            }
        });

    }

};

module.exports.findAndParse()
    .then(function(result) {
        return module.exports.startUpdate(result);
    })
    .then(function(quantity) {
        console.info(`Finished updating ${quantity} objects`);
        process.exit(0);
    })
    .catch(function(err) {
        console.error(err);
    });
