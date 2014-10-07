var utils = require(__dirname + '/utils')
    EventEmitter = require('events').EventEmitter;
    topicKeys = {
      'shutdown': 'command.device.shutdown',
      'restart': 'command.device.shutdown'
    },
    exchangeName = 'radiodan';

module.exports.create = function(client) {
  var instance = new EventEmitter();

  instance.shutdown = shutdown;
  instance.restart  = restart;
  instance.sendCommandForAction = function(action, options) {
    switch(action) {
      case 'shutdown':
        return shutdown();
      case 'restart':
        return restart();
      default:
        return utils.promise.reject('Unknown action '+action);
    }
  };

  instance.on = function() {};

  return instance;

  function shutdown() {
    return sendCommandForAction(client, 'shutdown', topicKeys['shutdown']);
  }

  function restart() {
    return sendCommandForAction(client, 'restart', topicKeys['restart']);
  }
}

function sendCommandForAction(client, action, topicKey) {
  var params = {};

  params.action = action;

  return client.createExchange({ exchangeName: exchangeName })
    .then(function () {
      return sendCommandToExchange(client, params, topicKey);
    })
  .then(null, utils.failedPromiseHandler());
}

function sendCommandToExchange(client, params, topicKey) {
  return client.sendCommand({
    exchangeName : exchangeName,
    topicKey     : topicKey,
    command      : params
  });
}
