var commandAndEvents = require('./command-and-events'),
    actions          = require('../static/actions/system.json'),
    system           = commandAndEvents.create(actions);

module.exports.create = function (client) {
  return system.create('system', client);
}
