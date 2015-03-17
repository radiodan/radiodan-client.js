var MessagingClient = require('radiodan-messaging-client'),
    utils = require('./utils'),
    defaults = {
      Subscriber: 'tcp://127.0.0.1:7172',
      Publisher: 'tcp://127.0.0.1:7173',
      Client: 'tcp://127.0.0.1:7171',
      Worker: 'tcp://127.0.0.1:7171'
    };

exports.create = function(opts) {
  opts = opts || {};

  var logger   = opts.logger || utils.logger(__filename),
      instance, paths;

  // validate options, adding defaults
  endpoints = validateEndpoints(opts);

  // create pub / sub / client / worker methods
  instance = {
    Publisher: curryWithDefault('Publisher'),
    Subscriber: curryWithDefault('Subscriber'),
    Client: curryWithDefault('Client'),
    Worker: curryWithDefault('Worker')
  };

  // that include scoped connection options
  return instance;

  function curryWithDefault(name) {
    var defaultEndpoint = endpoints[name],
        func = MessagingClient[name].create,
        instance = {};

    instance.create = function(name, endpoint) {
      endpoint = endpoint || defaultEndpoint;

      return func(endpoint, name);
    };

    return instance;
  }
};

function validateEndpoints(opts) {
  var endpoints = {};

  if(opts.hasOwnProperty('rpc')) {
    endpoints.Worker = opts.rpc;
    endpoints.Client = opts.rpc;
  }

  if(opts.hasOwnProperty('pub')) {
    endpoints.Publisher = opts.pub;
  }

  if(opts.hasOwnProperty('sub')) {
    endpoints.Subscriber = opts.sub;
  }

  return utils.mergeObjects(defaults, endpoints);
}
