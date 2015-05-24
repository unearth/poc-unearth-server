var dbUtils = require('./dbUtils');

////////////////////////
// MARKER ROUTES

// Adds all passed markers into the database.
var addMarkers = function(userId, markers, callback) {
  callback = callback || function(value) { return value; };
  var query = "INSERT into markers (user_id, location, group_id, name, description, image_url) VALUES";
  var params = [userId];

  // Loops through the markers array and adds them to the query string
  for (var i = 0; i < markers.length; i++) {

    // Reject if a required item is undefined
    if( (markers[i].name === undefined) ||
        (markers[i].location === undefined) ||
        (markers[i].groupId  === undefined)){
      callback("Undefined properties");
      return;
    }

    // Prepares the query string and params array for a mass single insert
    // markers[i] === [latitude, longitude]
    params.push(
      markers[i].location[0],
      markers[i].location[1],
      markers[i].groupId,
      markers[i].name,
      markers[i].description,
      markers[i].imageUrl
      );

    query = query + (' ($1,POINT($' + (i*6 + 2) + ',$' + (i*6 + 3) + '),$' +
      (i*6 + 4) + ',$' + (i*6 + 5) + ',$' + (i*6 + 6) + ',$' + (i*6 + 7) + ')');
    // Adds a comma or return statement at the end depending on whether the string is ending
    query += (i === markers.length - 1) ? 'RETURNING * ;' : ',';
  }

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};


var getMarkers = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT * FROM markers WHERE user_id = $1;';
  var params = [userId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    // Convert the database format into the format used in the frontend
    result.rows = result.rows || [];
    for ( var i = 0; i < result.rows.length; i++ ) {
      result.rows[i].location = ([result.rows[i].location.x, result.rows[i].location.y]);
    }

    callback(null, result.rows);
  });
};


module.exports = {
  getMarkers: getMarkers,
  addMarkers: addMarkers
};
