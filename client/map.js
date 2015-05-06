L.mapbox.accessToken = 'pk.eyJ1IjoidHJhdmlzam4iLCJhIjoiV3lfS1NiayJ9.6b0J09RJM9dBc_Nn_VpvZg';

var mapViewStart = [37.782551, -122.445368];  // Coordinates of center point of map on load

// L.mapbox.map(id of html element where map will be appended, map id or tilejson object)
// .setView(coordinates of center point of map on load, zoom level)
var map = L.mapbox.map('map', 'travisjn.67abbc98').setView(mapViewStart, 16);

var drawMap = function(coordinates) {

  // Deletes old layers
  map.eachLayer(function (layer) {
    if (layer._leaflet_id > 25) {
      map.removeLayer(layer);
    }
  });

  // Fog overlay layer
  var layer = L.TileLayer.maskCanvas({
    radius: 25,              // Radius in meters (see useAbsoluteRadius) of transparent points
    useAbsoluteRadius: true, // True: r in meters, false: r in pixels
    color: '#999999',        // The color of the fog overlay layer
    opacity: 0.8,            // Opacity of the fog overlay
    noMask: false,           // True results in normal (filled) circled, instead masked circles
    lineColor: '#000000'     // Color of the circle outline if noMask is true
  });

  // layer.setData(array of coordinate arrays[[lat, lng],[lat, lng], ...])
  layer.setData(coordinates);
  map.addLayer(layer);
};

var getWaypoints = function() {
  
  // Sends a get request for waypoints
  $.ajax({
    type: "GET",
    url: "http://localhost:3000/waypoints",
    dataType: "jsonp",
    email: "ben@ben.com",
    headers: {
      "Authorization": "Basic " + btoa("ben@ben.com" + ":" + "mysecurepassword")
    }
  }).done(function(data) {
    console.log('hello');
  });

};
getWaypoints();
