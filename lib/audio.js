var commandAndEvents = require('./command-and-events'),
    actions          = require('../static/actions/audio.json'),
    system           = commandAndEvents.create(actions);

module.exports = commandAndEvents.create(actions, 'audio');
