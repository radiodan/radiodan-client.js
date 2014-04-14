var commandAndEvents = require('./command-and-events'),
    actions          = require('../static/actions/rgb-led.json'),
    system           = commandAndEvents.create(actions);

module.exports.create = commandAndEvents.create(actions, 'rgb-led');
