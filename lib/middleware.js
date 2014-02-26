var browserify   = require('browserify'),
    connect      = require('connect'),
    utils        = require('./utils');

var messagingClient = require('./messaging-client'),
    radiodanClient  = require('./radiodan-client')
    radiodan        = radiodanClient.create(messagingClient.create()),
    radios          = {};

var bundler = browserify(__dirname+'/../static/client');

utils.logger.setLevel('debug');

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
      case eventStreamRequest(req, res):
        break;
      default:
        return next();
    }
  }
}

function commandRequest(req, res) {
  var commandUrl = route('/command'),
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
    .then(
      function(reply) {
        var response = {
          data: reply.response || {},
          error: reply.error
        };
        res.write(JSON.stringify(response));
      },
      function(error) {
        res.write(JSON.stringify({error: error}));
      })
    .then(function() { res.end() });
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

function eventStreamRequest(req, res) {
  var commandUrl = route('/stream'),
      commandId;

  if(!isRequest(commandUrl, req.originalUrl)) {
    return false;
  }

  commandId = (new RegExp(commandUrl)).exec(req.originalUrl)[1];
  radios[commandId] = radios[commandId] || radiodan.get(commandId);
  radio = radios[commandId];

  req.socket.setTimeout(Infinity);

  radio.on('message', function (data) {
    var msg = JSON.stringify(data);
    res.write('data: ' + msg + '\n\n');
  });

  res.writeHead(200, {
    'Content-Type' : 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection'   : 'keep-alive'
  });

  res.write('\n');

  return true;
}

function isRequest(regex, url) {
  return (new RegExp(regex)).test(url);
}

function route(path) {
  return path + '/player/(.*)$';
}
