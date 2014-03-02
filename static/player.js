var actions = require('./actions.json'),
    Q       = require('q'),
    EventEmitter = require('events').EventEmitter,
    xhr     = require('./xhr');

var player = {create: function(id){
  var instance = new EventEmitter(),
      eventSourcePromise,
      eventSource;

  instance.path = 'player/' + id;
  instance.key  = 'event.player.'+id;

  eventSourcePromise = subscribeToEvents(function (data) {
    var eventName = data.fields.routingKey.replace(instance.key+'.', '');
    instance.emit(eventName, data.content);
    instance.emit('message', data.content);
  });

  Object.keys(actions).forEach(function(key, index){
    var action = actions[key];
    instance[key] = function (options) {
      return eventSourcePromise.then(
              function () {
                return sendCommandForAction(action, options);
              }
            );
    };
  });

  function sendCommandForAction (action, options) {
    console.log('sendCommandForAction', action, options);
    return xhr(
        '/radiodan/command/' + instance.path,
        {action: action, options: options}
    ).then(
      function(response) {
        if(response.error) {
          console.warn('Command failed', response.error);
          return Q.reject(response.error);
        } else {
          console.log('Command completed', response);
          return Q.resolve(response.data);
        }
      }
    );
  }

  function subscribeToEvents(handler) {
    var deferred = Q.defer();

    if (!eventSource) {
      eventSource = new EventSource('/radiodan/stream/' + instance.path);
    }

    eventSource.addEventListener('message', function (evt) {
      var data;
      try {
        data = JSON.parse(evt.data);
        handler(data);
      } catch (e) {
        console.error(e);
      }
    });

    eventSource.addEventListener('open', function (evt) {
      deferred.resolve();
    });

    return deferred.promise;
  }

  return instance;
}};

module.exports = player;
