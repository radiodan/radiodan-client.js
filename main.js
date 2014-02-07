var RadiodanClient = require('./lib/radiodan-client'),
    MessagingClient = require('./lib/messaging-client'),
    utils = require('./lib/utils'),
    logger = utils.logger;

module.exports.create = function(opts) {
    opts = opts || {};

    var client = MessagingClient.create(opts);
    return RadiodanClient.create(client);
};

module.exports.setLogLevel = function(level) {
    logger.setLevel(level);
};

module.exports.utils = utils;
module.exports.MessagingClient = MessagingClient;
