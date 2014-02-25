var Q = require('q');

module.exports = function(url, params) {
  var deferred = Q.defer();

  var req = new XMLHttpRequest();
  req.open('POST', url);

  req.onload = function() {
    // This is called even on 404 etc
    // so check the status
    if (req.status == 200) {
      // Resolve the promise with the response text
      deferred.resolve(JSON.parse(req.response));
    }
    else {
      // Otherwise reject with the status text
      // which will hopefully be a meaningful error
      deferred.reject(Error(req.statusText));
    }
  };

  // Handle network errors
  req.onerror = function() {
    deferred.reject(Error("Network Error"));
  };

  req.setRequestHeader('Content-type', 'application/json')
  // Make the request
  if(params) {
    req.send(JSON.stringify(params));
  } else {
    req.send();
  }

  return deferred.promise;
}
