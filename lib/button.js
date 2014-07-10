var commandAndEvents = require('./command-and-events'),
    actions          = {},
    system           = commandAndEvents.create(actions);

module.exports = commandAndEvents.create(actions, 'button');
