var connect          = require('connect'),
    fs               = require('fs'),
    utils            = require('./utils'),
    allowCrossOrigin = require('./allow-cross-origin'),
    clientJS         = __dirname+'/../public/client.min.js';

var radiodanClient  = require('./radiodan-client');

module.exports = middleware;

function middleware(options) {
  // TODO: this needs to be a pre-build step for production
  var parseJSON = connect.json(),
      radiodan  = radiodanClient.create(),
      commandObjects = {};

  options = options || {};

  return respondToRequest;

  function respondToRequest(req, res, next) {
    var commandId, params;

    if(options.crossOrigin === true) {
      res = allowCrossOrigin(req, res);
    }

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

  function commandRequest(req, res) {
    var commandUrl = route('/command'),
        command, commandable;

    if(!isRequest(commandUrl, req.originalUrl)) {
      return false;
    }

    command = (new RegExp(commandUrl)).exec(req.originalUrl);
    commandable = objectForCommand(command[1], command[2]);

    res.setHeader('content-type', 'application/javascript');

    parseJSON(req, res, function(){
      var params = req.body,
      radio;

      commandable.sendCommandForAction(params.action, params.options)
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
        }
      )
      .then(function() { res.end() });
    });

    return true;
  }

  function clientRequest(req, res) {
    var readStream;

    if(!isRequest('/client.js$', req.originalUrl)) {
      return false;
    }

    readStream = fs.createReadStream(clientJS);

    res.setHeader('content-type', 'application/javascript');
    readStream.pipe(res);

    return true;
  }

  function eventStreamRequest(req, res) {
    var commandUrl = route('/stream'),
        command,
        commandable,
        commandId;

    function sendMessage(data) {
      var msg = JSON.stringify(data);
      res.write('data: ' + msg + '\n\n');
    }

    if(!isRequest(commandUrl, req.originalUrl)) {
      return false;
    }

    command = (new RegExp(commandUrl)).exec(req.originalUrl);
    commandable = objectForCommand(command[1], command[2]);

    commandable.on('message', sendMessage);

    req.socket.setTimeout(Infinity);

    req.on('end', function() {
      logger.debug('remove listener for eventstream');
      commandable.removeListener('message', sendMessage);
    });

    req.on('close', function() {
      logger.debug('remove listener for eventstream');
      commandable.removeListener('message', sendMessage);
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
    return path + '/(player|audio)/(.*)$';
  }

  function objectForCommand(commandType, commandId) {
    commandObjects[commandType] = commandObjects[commandType] || {};
    commandObjects[commandType][commandId] = commandObjects[commandType][commandId] || radiodan[commandType].get(commandId);

    return commandObjects[commandType][commandId];
  }
}
