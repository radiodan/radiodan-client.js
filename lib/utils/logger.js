var winston = require('winston'),
    path    = require('path');

var logLevel = process.env.LOG_LEVEL || 'warn';

var logger = function(filename) {
  var logName;

  if(filename) {
    logName = filename;
  } else if(module.parent) {
    logName = module.parent.id;
  } else {
    logName = __filename;
  }

  return new winston.Logger({
    level: logLevel,
    transports: [
      new winston.transports.Console({
        prettyPrint: true,
        timestamp: true,
        level: logLevel,
        label: path.basename(logName, '.js')
      })
    ]
  });
};

logger.setLevel = function (val) {
  logLevel = val;
}

module.exports = logger;
