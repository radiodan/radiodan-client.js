var actions = require('./actions.json'),
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
    xhr('/radiodan/command/'+id, {action: action, options: options}).then(
      function(data){console.log('finished', data)}
    );
    console.log('sendCommandForAction', action, options);
  }

  return instance;
}};

module.exports = player;