var actions = require('./actions.json'),
    Q       = require('q'),
    xhr     = require('./xhr');

var player = {create: function(id){
  var instance = {};
  instance.id = 'radio.' + id;

  Object.keys(actions).forEach(function(key, index){
    var action = actions[key];
    instance[key] = function (options) {
      return sendCommandForAction(action, options);
    };
  });

  function sendCommandForAction (action, options) {
    console.log('sendCommandForAction', action, options);
    return xhr(
        '/radiodan/command/'+id,
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

  return instance;
}};

module.exports = player;
