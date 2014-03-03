var messagingClient = require('./messaging-client'),
    Player = require('./player'),
    Audio  = require('./audio');

/*
// Listen to Volume changes in system
client.on('*', fn);

radio.on('*', fn);

// Stop all sounds

// Change volume of a specific player
// Change track of a specific player

client.discover().then(function (things) {
  things[0].play(myRadio4Url);
});
*/
module.exports.create = function () {
  var instance = {
    player: {},
    audio: {}
  };

  instance.audio.get = function (id) {
    return Audio.create(id, messagingClient.create());
  };

  instance.player.get = function (id) {
    return Player.create(id, messagingClient.create());
  };

  return instance;
};
