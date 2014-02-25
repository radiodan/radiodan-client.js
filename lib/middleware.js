var browserify   = require('browserify'),
    connect      = require('connect'),
    utils        = require('./utils');

var messagingClient = require('./messaging-client'),
    radiodanClient  = require('./radiodan-client')
    radiodan        = radiodanClient.create(messagingClient.create()),
    radios          = {};

var bundler = browserify(__dirname+'/../static/client');

bundler.transform({
  global: true
}, 'uglifyify');

var staticJS = utils.promise.npost(
      bundler, 'bundle'
    ),
    parseJSON = connect.json();

module.exports = function() {
  return function(req, res, next) {
    var commandId, params;

    switch(true) {
      case clientRequest(req, res):
        break;
      case commandRequest(req, res):
        break;
      default:
        return next();
    }
  }
}

function commandRequest(req, res) {
  var commandUrl = '/command/(.*)/?$',
      commandId;

  if(!isRequest(commandUrl, req.originalUrl)) {
    return false;
  }

  commandId = (new RegExp(commandUrl)).exec(req.originalUrl)[1];

  res.setHeader('content-type', 'application/javascript');

  parseJSON(req, res, function(){
    var params = req.body,
        radio;

    radios[commandId] = radios[commandId] || radiodan.get(commandId);

    radio = radios[commandId];

    radio.sendCommandForAction(params.action, params.options)
    .then(function(reply){
      res.write(JSON.stringify(reply));
      res.end();
    });
  });

  return true;
}

function clientRequest(req, res) {
  if(!isRequest('/client.js$', req.originalUrl)) {
    return false;
  }

  res.setHeader('content-type', 'application/javascript');

  staticJS.then(function(data) {
    res.write(data);
    res.end();
  });

  return true;
}

function isRequest(regex, url) {
  return (new RegExp(regex)).test(url);
}
