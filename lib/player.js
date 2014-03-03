var commandAndEvents = require('./command-and-events'),
    actions          = require('../static/actions.json');

module.exports.create = commandAndEvents.create(actions, 'player');
