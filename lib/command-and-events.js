var Q     = require('q'),
    utils = require('./utils'),
    EventEmitter = require('events').EventEmitter;

module.exports.create = function (actions, topicPrefix) {
  var instance = {};

  instance.create = create;
  instance.discover = discover;

  topicPrefix = topicPrefix || '';

  return instance;

  function discover(client) {
    // TODO: Query broker
  }

  function create(id, msgClient) {
    var instance   = new EventEmitter(),
        logger     = utils.logger(__filename),
        subscriber = msgClient.Subscriber.create(),
        client     = msgClient.Client.create(
          'radiodan-' + topicPrefix + '-' + id
        );

    if(topicPrefix != '') {
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
        return sendCommandForAction(action, params).then(
          function(response) {
            return utils.promise.resolve(response);
          },
          function(error) {
            return utils.promise.reject(error);
          }
        );
      };
    });

    instance.sendCommandForAction = sendCommandForAction;

    var eventTopicKey = 'event.' + instance.id + '.',
        allTopics     = eventTopicKey + '#';

    logger.debug('subscribed to '+allTopics);
    subscriber.subscribe(allTopics, function (topic, data) {
      // strip preable from event name
      var eventName = topic.replace(eventTopicKey, '');

      instance.emit(eventName, data);

      instance.emit('message', data, eventName);
    });

    /*
       Sends an action to the registered worker via broker.
       Returns a Promise that resolves on command success or
       rejects with an error.
       */
    function sendCommandForAction(action, params) {
      params = params || {};

      return client
        .sendCommand(topicPrefix, id, action, params)
        .then(null, utils.failedPromiseHandler());
    }

    return instance;
  };
};
