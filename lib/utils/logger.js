var winston    = require('winston'),
    path       = require('path'),
    logLevel   = process.env.LOG_LEVEL || 'warn',
    isolateLog = process.env.ISOLATE_LOG || false;

var logger = function(filename) {
  var label, level;

  label = determineLogName(filename);
  level = determineLogLevel(label);

  return new winston.Logger({
    level: level,
    transports: [
      new winston.transports.Console({
        prettyPrint: true,
        timestamp: true,
        level: level,
        label: label
      })
    ]
  });
};

logger.setLevel = function (val) {
  logLevel = val;
}

function determineLogName(filename) {
  var logName;

  if(filename) {
    logName = filename;
  } else if(module.parent) {
    logName = module.parent.id;
  } else {
    logName = __filename;
  }

  return path.basename(logName, ".js");
}

function determineLogLevel(label) {
  if(isolateLog && label != isolateLog) {
    return "off";
  } else {
    return logLevel;
  }
}

module.exports = logger;
