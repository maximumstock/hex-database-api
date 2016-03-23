'use strict';

/**
 * @file Exports a basic 404 handler middleware for koa
 */

module.exports = function() {

  return function* notFoundHandler(next) {

    yield next;

    if (this.status !== 404) {
      return;
    }

    this.redirect(process.env.NOT_FOUND_REDIRECT_URL || 'http://hexdbapi2.hexsales.net/docs');


  }


}
