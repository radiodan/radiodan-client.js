var actions = require('./actions/audio.json'),
    commandAndEvents = require('./command-and-events');

module.exports = function (url) {
  var create = commandAndEvents.create(url, 'audio', actions),
      cache  = {};

  function cacheOrCreate(id) {
    if(!cache.hasOwnProperty(id)) {
      cache[id] = create(id);
    }

    return cache[id];
  }

  return { create: cacheOrCreate, get: cacheOrCreate };
};
