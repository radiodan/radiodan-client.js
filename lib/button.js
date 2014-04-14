var commandAndEvents = require('./command-and-events'),
    actions          = {},
    system           = commandAndEvents.create(actions);

module.exports.create = commandAndEvents.create(actions, 'button');
