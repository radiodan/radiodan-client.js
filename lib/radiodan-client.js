var utils         = require('./utils'),
    messagingClient = require('./messaging-client'),
    Player        = require('./player'),
    Audio         = require('./audio'),
    Button        = require('./button'),
    RotaryEncoder = require('./rotary-encoder'),
    RGBLED        = require('./rgb-led');

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
    audio: {},
    button: {},
    rotaryEncoder: {},
    RGBLED: {},
    cache: {
      audios: {},
      players: {},
      buttons: {},
      rotaryEncoders: {},
      RGBLEDs: {}
    }
  };

  instance.audio.get = function (id) {
    var audio = instance.cache.audios[id];

    if(!audio) {
      audio = Audio.create(id, messagingClient.create());
      instance.cache.audios[id] = audio;
    }

    return audio;
  };

  instance.button.get = function (id) {
    var button = instance.cache.buttons[id];

    if(!button) {
      button = Button.create(id, messagingClient.create());
      instance.cache.buttons[id] = button;
    }

    return button;
  };

  instance.rotaryEncoder.get = function (id) {
    var rotaryEncoder = instance.cache.rotaryEncoders[id];

    if(!rotaryEncoder) {
      rotaryEncoder = RotaryEncoder.create(id, messagingClient.create());
      instance.cache.rotaryEncoders[id] = rotaryEncoder;
    }

    return rotaryEncoder;
  };

  instance.RGBLED.get = function (id) {
    var rgbLed = instance.cache.RGBLEDs[id];

    if(!rgbLed) {
      rgbLed = RGBLED.create(id, messagingClient.create());
      instance.cache.RGBLEDs[id] = rgbLed;
    }

    return rgbLed;
  };

  instance.player.discover = function () {
    return Player.discover(messagingClient.create());
  };

  instance.player.getAll = function () {
    var discovery         = instance.player.discover(),
        discoveredPlayers = utils.promise.defer();

    discovery.then(function(players) {
      var foundPlayers = players.map(function(player) {
        return instance.player.get(player.id);
      });

      discoveredPlayers.resolve(foundPlayers);
    });

    return discoveredPlayers.promise;
  };

  instance.player.get = function (id) {
    var player = instance.cache.players[id];

    if(!player) {
      player = Player.create(id, messagingClient.create());
      instance.cache.players[id] = player;
    }

    return player;
  };

  return instance;
};
