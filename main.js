var RadiodanClient  = require('./lib/radiodan-client'),
    MessagingClient = require('./lib/messaging-client'),
    middleware      = require('./lib/middleware'),
    utils           = require('./lib/utils'),
    logger          = utils.logger;

function create (opts) {
  opts = opts || {};

  var client = MessagingClient.create(opts);
  return RadiodanClient.create(client);
};

function setLogLevel(level) {
  logger.setLevel(level);
};

module.exports = {
  create: create,
  setLogLevel: setLogLevel,
  utils: utils,
  MessagingClient: MessagingClient,
  middleware: middleware
};
