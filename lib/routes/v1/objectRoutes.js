'use strict';

/**
 * @file Route defintions for `/v1/objects`
 */

const Router = require('koa-router');
const router = new Router();

const controllers = require('../../controllers');
const objectController = controllers.v1.objectController;

router.post('/objects/search', objectController.search);

router.get('/objects/properties/:property', objectController.getDistinctValuesForProperty);

module.exports = router;
