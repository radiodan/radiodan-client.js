var Q = require('q'),
    logger = require('./utils/logger'),
    failedPromiseHandler = require('./utils/failed-promise-handler');

module.exports = {
  logger: logger,
  promise: Q,
  failedPromiseHandler: failedPromiseHandler(logger, Q),
  uuid: require('./utils/uuid'),
  mergeObjects: require('./utils/merge-objects')
};
