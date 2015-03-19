var utils = require(__dirname + '/utils')
    EventEmitter = require('events').EventEmitter;

module.exports.create = function(msgClient) {
  var instance = new EventEmitter(),
      client   = msgClient.Client.create('radiodan-device');

  instance.shutdown = sendCommandForAction('shutdown');
  instance.restart  = sendCommandForAction('restart');

  instance.on = function() {};

  return instance;

  function sendCommandForAction(commandName) {
    return function() {
      return client.sendCommand('device', 'shutdown', commandName, {})
              .then(null, utils.failedPromiseHandler());
    };
  }
};
