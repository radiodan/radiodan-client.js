var RadiodanClient  = require('./lib/radiodan-client'),
    MessagingClient = require('./lib/messaging-client');

module.exports.create = function (opts) {
  opts = opts || {};

  var client = MessagingClient.create(opts);
  return RadiodanClient.create(client);
};
