exports.between = (num, start, end) => {
  return (num - start) * (num - end) <= 0;
};

// gets a object inside a map by string path
exports.byString = function(object, path) {
  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, '');           // strip a leading dot
  var a = path.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (k in object) {
      object = object[k];
    } else {
      return;
    }
  }
  return object;
}

exports.simpleDeepClone = (object) => {
    return JSON.parse(JSON.stringify(object));
}
