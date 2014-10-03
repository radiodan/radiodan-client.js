module.exports.create = function (url) {
  return {
    player: require('./player')(url),
    audio:  require('./audio')(url),
    device:  require('./device')(url)
  };
};

window.Radiodan = module.exports;
