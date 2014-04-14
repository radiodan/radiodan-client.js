var commandAndEvents = require('./command-and-events'),
    actions          = require('../static/actions/rotary-encoder.json'),
    system           = commandAndEvents.create(actions);

module.exports.create = commandAndEvents.create(actions, 'rotary-encoder');
