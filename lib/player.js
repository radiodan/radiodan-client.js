var commandAndEvents = require('./command-and-events'),
    actions          = require('../static/actions/player.json');

module.exports.create = commandAndEvents.create(actions, 'player');
