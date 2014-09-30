module.exports = function mergeObjects(defaultObj, specificObj) {
  var obj = JSON.parse(JSON.stringify(defaultObj)),
      cleanSpecificObj = JSON.parse(JSON.stringify(specificObj));

  Object.keys(cleanSpecificObj).forEach(function(key) {
    obj[key] = cleanSpecificObj[key];
  });

  return obj;
};
