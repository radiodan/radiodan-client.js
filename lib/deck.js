var utils  = require('./utils');

module.exports.create = function (id, client) {
  var instance = {},
      logger   = utils.logger(__filename);

  /*

  */
  instance.id = 'radio.' + id;

  instance.volume = function (params) {
    return sendCommandForAction('volume', params);
  };

  instance.playRandom = function (params) {
    return sendCommandForAction('random', params);
  };

  instance.play = function (params) {
    return sendCommandForAction('play', params);
  };

  function sendCommandForAction(action, params) {
    params.action = action;
    return client.createExchange({ exchangeName: 'radiodan' })
                 .then(function () {
                    return sendCommandToExchange(params);
                  })
                 .then(null, utils.failedPromiseHandler());
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
