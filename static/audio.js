var actions = require('./actions/audio.json'),
    commandAndEvents = require('./command-and-events');

module.exports = function (url) {
  var create = commandAndEvents.create(url, 'audio', actions);
  return { create: create };
};
