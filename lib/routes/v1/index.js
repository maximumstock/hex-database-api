'use strict';

/**
 * @file Exports a router that contains all routes for `/v1`
 */

const Router = require('koa-router');
const router = new Router({
    prefix: '/v1'
});

const objectRoutes = require('./objectRoutes');

router.use(objectRoutes.routes());
router.use(objectRoutes.allowedMethods());

module.exports = router;
