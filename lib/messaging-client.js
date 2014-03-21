var amqp = require('amqplib'),
    utils = require('./utils'),
    EventEmitter = require('events').EventEmitter;

exports.create = function(opts) {
  opts = opts || {};

  var logger = opts.logger || utils.logger(__filename),
      host = opts.host || 'localhost',
      instance = new EventEmitter(),
      pendingMessages = {},
      waitForChannel,
      pollForConnection;

  pollForConnection = function() {
    var connected = utils.promise.defer();
    var callCount = 0;

    function connect() {
      var connection = amqp.connect('amqp://' + host);
      return connection;
    }

    function success(connection) {
      connected.resolve(connection);
    }

    function tryConnect(now) {
      if(now === true) {
        connect().then(success, tryConnect);
      } else {
        logger.debug("Cannot connect, retrying");
        setTimeout(function() { connect().then(success, tryConnect); }, 1000);
      }
    }

    tryConnect(true);

    return connected.promise;
  }

  waitForChannel = pollForConnection().then(function(connection) {
    return connection.createConfirmChannel();
  });

  instance.sendToExchange = function(exchangeName, topicKey, message) {
    return waitForChannel.then(function(channel) {
      return sendToExchange(channel, exchangeName, topicKey, message);
    }, utils.failedPromiseHandler(logger));
  };

  instance.sendCommand = function(params) {
    var topicKey = params.topicKey,
        exchangeName = params.exchangeName,
        command = params.command,
        deferred = utils.promise.defer();

    command.correlationId = utils.uuid();

    // Mark this command as pending
    pendingMessages[command.correlationId] = deferred;

    waitForChannel.then(function(channel) {
      if (!instance.commandReplyQueue) {
        instance.commandReplyQueue = createDisposableQueue(channel);

        instance.commandReplyQueue.then(function(queue) {
          logger.info('waiting on ' + queue.queue);
          channel.consume(queue.queue, createMessageHandler(channel));
        }).then(null, utils.failedPromiseHandler(logger));
      }

      return instance.commandReplyQueue.then(function(queue) {
        logger.info('set queue', queue);
        sendToExchange(channel, exchangeName, topicKey, command, {
          replyTo: queue.queue
        });
      });
    }).then(null, utils.failedPromiseHandler(logger));

    return deferred.promise;
  };

  instance.createExchange = function(params) {
    var exchangeName = params.exchangeName;

    return waitForChannel.then(function(channel) {
      return createTopicExchange(channel, exchangeName)
    }, utils.failedPromiseHandler());
  };

  instance.createAndBindToExchange = function(params) {
    var queueName = params.queueName,
        exchangeName = params.exchangeName,
        topicsKey = params.topicsKey;

    return waitForChannel.then(function(channel) {
      return utils.promise.spread(
        [
          createTopicExchange(channel, exchangeName),
          createDisposableQueue(channel, queueName)
        ],
        function(exchange, queue) {
          channel.bindQueue(queue.queue, exchangeName, topicsKey);
          channel.consume(queue.queue, createMessageHandler(channel));
        }
      );
    }).then(null, utils.failedPromiseHandler());
  };

  instance.sendToQueue = function(queueName, message) {
    return waitForChannel.then(function(channel) {
      return channel.sendToQueue(queueName, formatMessage(message));
    }).then(null, utils.failedPromiseHandler());
  };

  return instance;

  function createMessageHandler(channel) {
    return function(data) {
      data.acked = false;

      logger.debug(
          'recieved msg',
          (data.fields || null),
          (data.properties || null)
          );

      try {
        data.content = JSON.parse(data.content);
      } catch (err) {
        logger.error(err.stack);
        data.content = {};
      }

      data.ack = function() {
        if (!data.acked) {
          var acked = channel.ack(data);
          data.acked = true;
        }
      };

      clearPendingMessage(data);

      /*
        Emits for every part of routing key.
        e.g. 'event.radio.1.volume' will emit:
          'event.#',
          'event.radio.#',
          'event.radio.1.#',
          'event.radio.1.volume',
          'message'
      */
      var routes = data.fields.routingKey.split('.'),
          eventName = '';

      delete routes[routes.length - 1];

      routes.forEach(function (item, index) {
        eventName += routes[index] + '.';
        instance.emit(eventName + '#', data);
      });

      instance.emit(data.fields.routingKey, data);
      instance.emit('message', data);
    }
  }

  function createTopicExchange(channel, name) {
    return channel.assertExchange(name, 'topic');
  }

  function createDisposableQueue(channel, name) {
    // Queue expires on RabbitMQ restart or consumer disconnects
    return channel.assertQueue(name, {
      durable: false,
      autoDelete: true
    });
  }

  function formatMessage(message) {
    var messageJSON = JSON.stringify(message);
    return new Buffer(messageJSON);
  }

  function sendToExchange(channel, exchangeName, topicKey, message, options, cb) {
    logger.info('published to %s', topicKey, message);
    return channel.publish(
      exchangeName, topicKey, formatMessage(message), (options || {}), cb
    );
  }

  function clearPendingMessage(data) {
    var content = data.content,
        deferred;

    if (content && content.correlationId) {
      deferred = pendingMessages[content.correlationId];

      if (deferred) {
        if (content.error) {
          logger.debug('rejecting pending message with error', content);
          deferred.reject(content.error);
        } else {
          logger.debug('resolving pending message', content);
          deferred.resolve(content);
        }

        delete pendingMessages[content.correlationId];
      }
    }
  }
};
