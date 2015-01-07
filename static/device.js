var actions = require('./actions/device.json'),
    commandAndEvents = require('./command-and-events');

module.exports = function (url) {
  var create = commandAndEvents.create(url, 'device', actions),
      cache;

  function cacheOrCreate() {
    if(!cache) {
      cache = create('shutdown');
    }

    return cache;
  }

  return { create: cacheOrCreate, get: cacheOrCreate };
};
