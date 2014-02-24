var clientRegex  = new RegExp('/client.js$'),
    commandRegex = new RegExp('/command/(.*)/?$'),
    fs           = require('fs'),
    clientLib    = fs.readFileSync(__dirname + '/../static/client.js'),
    messagingClient = require('./messaging-client')
    radiodan     = require('./radiodan-client').create(messagingClient.create()),
    radios       = {};

module.exports = function() {
  return function(req, res, next) {
    var commandId;

    if(clientRegex.test(req.originalUrl)) {
      res.setHeader('content-type', 'application/javascript');
      res.write(clientLib);
      res.end();
    } else if (commandId = commandRegex.exec(req.originalUrl)) {
      commandId = commandId[1];
      radios[commandId] = radiodan.get(commandId);
      radios[commandId].volume({value: 71});
      res.end("THIS IS A COMMAND: "+commandId);
    } else {
      next();
    }
  }
}