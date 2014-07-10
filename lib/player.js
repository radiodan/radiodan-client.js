var commandAndEvents = require('./command-and-events'),
    actions          = require('../static/actions/player.json');

module.exports = commandAndEvents.create(actions, 'player');
