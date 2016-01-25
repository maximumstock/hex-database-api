'use strict';

exports.up = function(knex, Promise) {

    return knex.schema.createTable('objects', function(table) {
        table.json('data', true);
    });

};

exports.down = function(knex, Promise) {

    return knex.schema.dropTableIfExists('objects');

};
