var actions = require('./actions/audio.json'),
    commandAndEvents = require('./command-and-events');

var create = commandAndEvents.create('audio', actions);

module.exports = {create: create};
