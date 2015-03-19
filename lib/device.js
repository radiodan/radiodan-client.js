var utils = require(__dirname + '/utils')
    EventEmitter = require('events').EventEmitter;

module.exports.create = function(msgClient) {
  var instance = new EventEmitter(),
      client   = msgClient.Client.create('radiodan-device');

  instance.shutdown = function() { return sendCommandForAction('shutdown'); };
  instance.restart  = function() { return sendCommandForAction('restart'); };
  instance.sendCommandForAction = sendCommandForAction;

  instance.on = function() {};

  return instance;

  function sendCommandForAction(commandName, _) {
    return client.sendCommand('device', 'shutdown', commandName, {})
            .then(null, utils.failedPromiseHandler());
  }
};
