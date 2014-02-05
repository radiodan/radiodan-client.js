var Q     = require('q'),
    utils = require('./utils');

module.exports.create = function (id, client) {
  var instance = {},
      logger   = utils.logger(__filename),
      pendingMessages = {};

  /*

  */
  instance.id = 'radio.' + id;

  instance.volume = function (params) {
    console.log('volume should return promise');
    return sendCommandForAction('volume', params);
  };

  instance.playRandom = function (params) {
    return sendCommandForAction('random', params);
  };

  instance.play = function (params) {
    return sendCommandForAction('play', params);
  };

  client.on('message', handleClientMessage);

  function handleClientMessage(data) {
    var deferred,
        content = data.content;

    logger.debug('Incoming message', data.content);

    if (content && content.correlationId) {
      deferred = pendingMessages[content.correlationId];

      if (content.error) {
        deferred.reject(content.error);
      } else {
        deferred.resolve(content);
      }

      delete pendingMessages[content.correlationId];
    }
  }

  function sendCommandForAction(action, params) {
    var deferred = Q.defer(),
        sendPromise;

    params.action = action;
    sendPromise = client.createExchange({ exchangeName: 'radiodan' })
                        .then(function () {
                           return sendCommandToExchange(params);
                          })
                        .then(null, utils.failedPromiseHandler());

    sendPromise.then(function (command) {
      pendingMessages[command.correlationId] = deferred;
    });

    return deferred.promise;
  }

  function sendCommandToExchange(params) {
    return client.sendCommand({
      exchangeName : 'radiodan',
      topicKey     : instance.id + '.command',
      command      : params
    });
  }

  return instance;
};
