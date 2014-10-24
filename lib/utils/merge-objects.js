module.exports = function mergeObjects(defaultObj, specificObj) {
  var merged = {},
      defaultKeys, specificKeys;

  defaultObj  = defaultObj  || {};
  specificObj = specificObj || {};

  defaultKeys  = Object.keys(defaultObj);
  specificKeys = Object.keys(specificObj);

  specificKeys.forEach(function(key) {
    merged[key] = specificObj[key];
  });

  defaultKeys.forEach(function(key) {
    if(!merged.hasOwnProperty(key)) {
      merged[key] = defaultObj[key];
    }
  });

  return merged;
};
