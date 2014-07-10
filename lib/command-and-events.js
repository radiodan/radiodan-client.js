var Q     = require('q'),
    utils = require('./utils'),
    EventEmitter = require('events').EventEmitter,
    exchangeName = 'radiodan';

module.exports.create = function (actions, topicPrefix) {
  var instance = {};

  instance.create = create;
  instance.discover = discover;

  return instance;

  function discover(client) {
    var discovered = utils.promise.defer();

    client.createExchange({exchangeName: exchangeName})
      .then(function () {
        client.sendCommand({
          exchangeName : exchangeName,
          topicKey     : 'command.discovery.'+topicPrefix,
          command      : {}
        });

        client.on('message', function(data) {
          data.ack();
          discovered.resolve(data.content.response);
        });
      })
    .then(null, utils.failedPromiseHandler());

    return discovered.promise;
  }

  function create(id, client) {
    var instance = new EventEmitter(),
        logger   = utils.logger(__filename);

    if(topicPrefix) {
      instance.id = topicPrefix + '.' + id;
    } else {
      instance.id = id;
    }

    /*
     * This creates methods to send commands
     */
    Object.keys(actions).forEach(function(key, index){
      var action = actions[key];
      instance[key] = function (params) {
        return sendCommandForAction(action, params).then(function(result) {
          if(result.error) {
            return utils.promise.reject(result.error);
          } else {
            return utils.promise.resolve(result.response);
          }
        });
      };
    });

    instance.sendCommandForAction = sendCommandForAction;

    var eventTopicKey = 'event.' + instance.id + '.',
        allTopics     = eventTopicKey + '#';

    client.createAndBindToExchange({
      exchangeName: 'radiodan',
      topicsKey:    allTopics
    });

    client.on(allTopics, function (data) {
      var thisTopic;

      try {
        var routingKey = data.fields.routingKey;

        thisTopic  = routingKey.replace(eventTopicKey, '');
      } catch (err) {
        logger.warn(err);
      }

      if(thisTopic) {
        instance.emit(thisTopic, data.content);
      }

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

      return client.createExchange({ exchangeName: exchangeName })
        .then(function () {
          return sendCommandToExchange(params);
        })
      .then(null, utils.failedPromiseHandler());
    }

    function sendCommandToExchange(params) {
      return client.sendCommand({
        exchangeName : exchangeName,
        topicKey     : 'command.' + instance.id,
        command      : params
      });
    }

    return instance;
  };
};
