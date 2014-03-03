var actions = require('./actions/player.json'),
    commandAndEvents = require('./command-and-events');

var create = commandAndEvents.create('player', actions);

module.exports = {create: create};
