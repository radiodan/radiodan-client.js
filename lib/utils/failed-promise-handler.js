module.exports = function(sharedLogger, promise) {
  return function failedPromiseHandler(logger) {
    logger = logger || sharedLogger();

    return function(err) {
      if (err instanceof Error) {
        logger.error(err.stack);
      } else {
        logger.warn(err);
      }

      return promise.reject(err);
    };
  }
};
