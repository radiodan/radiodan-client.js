var clientRegex  = new RegExp('/client.js$'),
    commandRegex = new RegExp('/command/(.*)/?$'),
    browserify   = require('browserify'),
    connect      = require('connect'),
    utils        = require('./utils'),
    messagingClient = require('./messaging-client'),
    radiodan     = require('./radiodan-client').create(messagingClient.create()),
    radios       = {};

var staticJS = utils.promise.npost(browserify(__dirname+'/../static/client'), 'bundle'),
    JsonParse = connect.json();

module.exports = function() {
  return function(req, res, next) {
    var commandId, params;

    res.setHeader('content-type', 'application/javascript');

    if(clientRegex.test(req.originalUrl)) {
      staticJS.then(function(data) {
        res.write(data);
        res.end();
      });
    } else if (commandId = commandRegex.exec(req.originalUrl)) {
      commandId = commandId[1];

      JsonParse(req, res, function(){
        params = req.body;
        radios[commandId] = radiodan.get(commandId);
        radios[commandId].sendCommandForAction(params.action, params.options).then(function(reply){
          res.write(JSON.stringify(reply)); 
          res.end();
        });
      });
    } else {
      next();
    }
  }
}