var actions = require('./actions.json');

var player = {create: function(id){
  var instance = {};
  instance.id = 'radio.' + id;

  Object.keys(actions).forEach(function(key, index){
    var action = actions[key];
    instance[key] = function (params) {
      return sendCommandForAction(action, params);
    };
  });

  function sendCommandForAction (action, params) {
    console.log('sendCommandForAction', action, params);
  }

  return instance;
}};

module.exports = player;