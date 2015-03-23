var utils = require(__dirname + '/utils')
    EventEmitter = require('events').EventEmitter;

module.exports.create = function(msgClient) {
  var instance = new EventEmitter(),
      serviceType = 'device',
      serviceInstance = 'shutdown',
      client   = msgClient.Client.create('radiodan-device'),
      readyPromise;

  instance.shutdown = function() { return sendCommandForAction('shutdown'); };
  instance.restart  = function() { return sendCommandForAction('restart'); };
  instance.sendCommandForAction = sendCommandForAction;

  instance.on = function() {};

  return instance;

  function sendCommandForAction(commandName, _) {
    return ready().then(function() {
      return client.sendCommand(serviceType, serviceInstance, commandName, {});
    }).then(null, utils.failedPromiseHandler());
  }

  function ready() {
    if(typeof readyPromise === 'undefined') {
      readyPromise = client.waitForService(serviceType, serviceInstance)
        .then(null, utils.failedPromiseHandler(logger));
    }

    return readyPromise;
  }
};
