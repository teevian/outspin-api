
/*
  Source:
  http://janmatuschek.de/LatitudeLongitudeBoundingCoordinates
*/

function degreesToRadians(degrees) {
  return degrees * Math.PI / 180;
}

function radiansToDegrees(radians) {
  return radians * (180 / Math.PI);
}

exports.distance = function distanceInKmBetweenEarthCoordinates(lat1, lon1, lat2, lon2) {
  var earthRadiusKm = 6371;

  /*var dLat = degreesToRadians(lat2-lat1);
  var dLon = degreesToRadians(lon2-lon1);

  lat1 = degreesToRadians(lat1);
  lat2 = degreesToRadians(lat2);*/

  var dLat = lat2 - lat1;
  var dLon = lon2 - lon1;

  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadiusKm * c * 1000;
}

exports.getRange = function getRange(lat, lon, radius) {
  let coorRange = {};
  lat = degreesToRadians(lat);
  lon = degreesToRadians(lon);
  let earthRadius = 6371000;
  let r = radius / earthRadius;
  coorRange.r = r;

  coorRange.latMin = radiansToDegrees(lat - r);
  coorRange.latMax = radiansToDegrees(lat + r);


  let latT = Math.asin(Math.sin(lat) / Math.cos(r));
  let deltaLon = Math.asin(Math.sin(r) / Math.cos(lat));

  coorRange.lonMin = radiansToDegrees(lon - deltaLon);
  coorRange.lonMax = radiansToDegrees(lon + deltaLon);
  return coorRange;
}
