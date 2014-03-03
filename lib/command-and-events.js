var Q     = require('q'),
    utils = require('./utils'),
    EventEmitter = require('events').EventEmitter;

module.exports.create = function (actions, topicPrefix) {
  return function (id, client) {
    var instance = new EventEmitter(),
        logger   = utils.logger(__filename);

    instance.id = topicPrefix + '.' + id;

    /*
     * This creates methods to send commands
     */
    Object.keys(actions).forEach(function(key, index){
      var action = actions[key];
      instance[key] = function (params) {
        return sendCommandForAction(action, params);
      };
    });

    instance.sendCommandForAction = sendCommandForAction;

    var eventTopicKey = 'event.' + instance.id + '.#';

    client.createAndBindToExchange({
      exchangeName: 'radiodan',
      topicsKey:    eventTopicKey
    });

    client.on(eventTopicKey, function (data) {
      instance.emit('message', data);
    });

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
             topicKey     : 'command.' + instance.id,
             command      : params
      });
    }

    return instance;
  };
};
