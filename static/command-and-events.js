var Q            = require('q'),
    EventEmitter = require('events').EventEmitter,
    xhr          = require('./xhr');

module.exports = {create: create};

function create(url, namespace, actions) {
  url       = (url || '').toString();
  namespace = namespace || '';
  actions   = actions || {};

  // strip trailing / from url
  if(url[url.length-1] === '/') {
    url = url.substring(0, url.length-1);
  }

  return function(id) {
    var instance = new EventEmitter(),
        eventSourcePromise,
        eventSource;

    instance.path = namespace + '/' + id;
    instance.key  = 'event.' + namespace + '.' + id;

    eventSourcePromise = subscribeToEvents(function (data) {
      instance.emit(data.topic, data.content);
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
      var request = xhr(
            url + '/radiodan/command/' + instance.path,
            {action: action, options: options}
          ),
          parse = function(response) {
            if(response.error) {
              console.warn('Command failed', response.error);
              return Q.reject(response.error);
            } else {
              console.log('Command completed', response);
              return Q.resolve(response.data);
            }
          };

      return request.then(parse);
    }

    function subscribeToEvents(handler) {
      var deferred = Q.defer();

      if (!eventSource) {
        eventSource = new EventSource(
          url + '/radiodan/stream/' + instance.path
        );
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
  };
};
