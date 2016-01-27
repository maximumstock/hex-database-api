'use strict';

/**
 * @file Route defintions for `/v1/objects`
 */

const Router = require('koa-router');
const router = new Router();

const controllers = require('../../controllers');
const objectController = controllers.v1.objectController;

router.get('/objects', objectController.getAll);
router.post('/objects/search', objectController.search);

module.exports = router;
