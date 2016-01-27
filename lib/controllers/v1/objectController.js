'use strict';

/**
 * @file Route handler for `/v1/objects`
 */

const knex = require('../../db');

module.exports = {

    /**
     * @httpmethod GET
     * @function Returns all objects from the database
     */
    getAll: function* getAll(next) {

        const result = yield knex('objects').select('data');

        // apparently I'm not able to query on the subcontents of `data`, so we have to nicefy each object manually
        const allObjects = [];
        for(let i = 0; i < result.length; i++) {
            allObjects.push(result[i].data);
        }

        this.body = allObjects;
        this.status = 200;

        yield next;

    },

    /**
     * @httpmethod POST
     * @function Returns all objects from the database that meet the requirements specified in the request body
     */
    search: function* search(next) {

        // build a query instance that we can alter over the course of search parameter validation
        let query = knex('objects').select('data');

        // go through `req.body` and search for parameters

        // `name`
        if(this.request.body.name && typeof this.request.body.name === 'string') {
            query.whereRaw('data->>\'name\' LIKE ?', ['%' + this.request.body.name + '%']);
        }

        const allObjects = [];
        const result = yield knex.raw(query.toString());
        for(let i = 0; i < result.rows.length; i++) {
            allObjects.push(result.rows[i].data);
        }

        this.body = allObjects;
        this.status = 200;

        yield next;
    }

};
