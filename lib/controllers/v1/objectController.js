'use strict';

/**
 * @file Route handler for `/v1/objects`
 */

const knex = require('../../db');


/**
 * @function helper function to modify a knex query object based on integer value spec
 * @param {object} body - The request body
 * @param {object} query - The query object to manipulate
 * @param {string} propName - The name of the property for query on
 */

function addIntegerParams(body, query, propName) {

    if(body[propName]) {

        const obj = body[propName];

        // if `obj` is a number -> just add it to the query
        if(typeof obj === 'number') {
            query.whereRaw('data->>\'?\' = ?', [propName, obj]);
        }

        // if `obj` is an object -> check for properties `lte`/`gte` then `lt`/`gt`
        if(typeof obj === 'object') {

            if(obj.hasOwnProperty('lte') && typeof obj.lte === 'number') {
                query.whereRaw('data->>? <= ?', [propName, obj.lte]);
            } else if(obj.hasOwnProperty('lt') && typeof obj.lt === 'number') {
                query.whereRaw('data->>? < ?', [propName, obj.lt]);
            }

            if(obj.hasOwnProperty('gte') && typeof obj.gte === 'number') {
                query.whereRaw('data->>? >= ?', [propName, obj.gte]);
            } else if(obj.hasOwnProperty('gt') && typeof obj.gt === 'number') {
                query.whereRaw('data->>? > ?', [propName, obj.gt]);
            }

        }

    }

}

/**
 * @function helper function to modify a knex query object based on array value spec
 * @param {object} body - The request body
 * @param {object} query - The query object to manipulate
 * @param {string} propName - The name of the property for query on
 */

function addArrayParams(body, query, propName) {

    if(body.hasOwnProperty(propName) && typeof Array.isArray(body[propName])) {

        const data = {};
        data[propName] = body[propName];

        // sure, this is dirty as fuck, but apparently knex or the underlying pg module
        // escape all quotation marks in a way that postgres can't deal with in jsonb format
        query.whereRaw('data @> \'' + JSON.stringify(data) + '\'');

    }

}

module.exports = {

    /**
     * @httpmethod GET
     * @function Returns all objects from the database
     */
    getAll: function* getAll(next) {

        const result = yield knex('objects').select('data');

        // apparently I'm not able to query on the subcontents of `data`, so we have to nicefy each object manually
        const allObjects = [];
        for (let i = 0; i < result.length; i++) {
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

        /***********************************************************************
        ************************** STRING PARAMETERS ***************************
        ***********************************************************************/

        // `name`
        if (this.request.body.name && typeof this.request.body.name === 'string') {
            query.whereRaw('data->>\'name\' iLIKE ?', ['%' + this.request.body.name + '%']);
        }

        // `sub_type`
        if(this.request.body.sub_type && typeof this.request.body.sub_type === 'string') {
            query.whereRaw('data->>\'sub_type\' iLIKE ?', ['%' + this.request.body.sub_type + '%']);
        }

        // `faction`
        if(this.request.body.faction && typeof this.request.body.faction === 'string') {
            query.whereRaw('data->>\'faction\' = ?', [this.request.body.faction]);
        }

        // `rarity`
        if(this.request.body.rarity && typeof this.request.body.rarity === 'string') {
            query.whereRaw('data->>\'rarity\' = ?', [this.request.body.rarity]);
        }

        // `set_number`
        if(this.request.body.set_number && typeof this.request.body.set_number === 'string') {
            query.whereRaw('data->>\'set_number\' = ?', [this.request.body.set_number]);
        }

        /***********************************************************************
        ************************** INTEGER PARAMETERS **************************
        ***********************************************************************/

        // `atk`
        addIntegerParams(this.request.body, query, 'atk')

        // `health`
        addIntegerParams(this.request.body, query, 'health')

        // `cost`
        addIntegerParams(this.request.body, query, 'cost')

        // `socket_count`
        addIntegerParams(this.request.body, query, 'socket_count')


        /***********************************************************************
        *************************** ARRAY PARAMETERS ***************************
        ***********************************************************************/

        // `type`
        addArrayParams(this.request.body, query, 'type');

        // `color`
        addArrayParams(this.request.body, query, 'color');

        // `threshold`
        addArrayParams(this.request.body, query, 'threshold');



        // add sorting
        query.orderByRaw('data->>\'name\' ASC');

        const allObjects = [];
        const result = yield knex.raw(query.toString());
        for (let i = 0; i < result.rows.length; i++) {
            allObjects.push(result.rows[i].data);
        }

        this.body = allObjects;
        this.status = 200;

        yield next;
    },

    /**
     * @httpmethod GET
     * @function Returns all distinct values for {property}
     */
    getDistinctValuesForProperty: function* getDistinctValuesForProperty(next) {

        const propertyName = this.params.property;

        if (typeof propertyName !== 'string') {
            propertyName = propertyName.toString(); // make sure `propertyName` is a string
        }

        const response = [];

        // check if property `propertyName` exists
        const result = yield knex.raw('select * from objects where (data->?) is not null limit 1', [propertyName]);

        if (result.rows.length > 0) {
            // if the property `propertyName` exists, we can run a simple distinct query
            const distinctValues = yield knex.raw('SELECT distinct data->? as prop FROM objects ORDER BY prop ASC;', [propertyName]);
            distinctValues.rows.forEach(function(d) {
                response.push(d.prop);
            });
        }

        this.body = response;
        this.status = 200;

        yield next;

    }

};
