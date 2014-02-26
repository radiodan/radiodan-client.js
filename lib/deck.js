var Q     = require('q'),
    utils = require('./utils'),
    actions = require('../static/actions.json');

module.exports.create = function (id, client) {
  var instance = {},
      logger   = utils.logger(__filename);

  instance.id = 'radio.' + id;

  /*
    This creates methods to send commands, as listed
    in `../static/actions.json`.
  */
  Object.keys(actions).forEach(function(key, index){
    var action = actions[key];
    instance[key] = function (params) {
      return sendCommandForAction(action, params);
    };
  });

  instance.sendCommandForAction = sendCommandForAction;

  /*
    Sends an action to the 'radio.<id>.command' channel
    Returns a Promise that resolves on command success or
    rejects with an error.
  */
  function sendCommandForAction(action, params) {
    params = params || {};

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
