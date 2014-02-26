var Player = require('./player');

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
module.exports.create = function (messagingClient) {
  var instance = {};

  /*
    get(id)
    Returns a Player
  */
  instance.get = function (id) {
    return Player.create(id, messagingClient);
  };

  return instance;
};
