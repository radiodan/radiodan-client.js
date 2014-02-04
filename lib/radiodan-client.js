var Deck = require('./deck');

/*
// Listen to Volume changes in system
client.on('*', fn);

radio.on('*', fn);

// Stop all sounds

// Change volume of a specific deck
// Change track of a specific deck

client.discover().then(function (things) {
  things[0].play(myRadio4Url);
});
*/
module.exports.create = function (messagingClient) {
  var instance = {};

  /*
    get(id)
    Returns a Deck
  */
  instance.get = function (id) {
    return Deck.create(id, messagingClient);
  };

  return instance;
};
