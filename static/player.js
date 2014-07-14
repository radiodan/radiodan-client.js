var actions = require('./actions/player.json'),
    commandAndEvents = require('./command-and-events');

module.exports = function (url) {
  var create = commandAndEvents.create(url, 'player', actions);
  return { create: create };
};
