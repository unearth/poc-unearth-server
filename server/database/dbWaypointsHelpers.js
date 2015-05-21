var dbUtils = require('./dbUtils');

////////////////////////
// WAYPOINT ROUTES

// Adds all passed waypoints into the database.
var addAllWaypoints = function(userId, waypoints, callback) {
  callback = callback || function(value) { return value; };
  var query = "INSERT into waypoints (user_id, location) VALUES";
  var params = [userId];

  // Loops through the waypoints array and adds them to the query string
  for (var i = 0; i < waypoints.length; i++) {

    // Prepares the query string and params array for a mass single insert
    // waypoints[i] === [latitude, longitude]
    params.push(waypoints[i][0], waypoints[i][1]);
    query = query + (' ($1,POINT($' + (i*2 + 2) + ',$' + (i*2 + 3) + '))');

    // Adds a comma or return statement at the end depending on whether the string is ending
    query += (i === waypoints.length - 1) ? 'RETURNING * ;' : ',';
  }

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

// Checks whether waypoints are in the database.
// Uses addAllWaypoints to add waypoints to the database
var addUniqueWaypoints = function(userId, waypoints, callback) {
  callback = callback || function(value) { return value; };
  var query = "SELECT * FROM waypoints where user_id = $1";
  var params = [userId];

  dbUtils.makeQuery(query, params, function(error, result) {

    // Removes any waypoints that already exists on our user's table
    var filteredWaypoints = waypoints.filter( function(item) {
      for(var i = 0; i < result.rows.length; i++) {
        if(result.rows[i].location.x === item[0] && result.rows[i].location.y === item[1]) {
          return false;
        }
      }
      return true;
    });

    // Add waypoints to the database, or callback an empty array if the waypoints already exist
    if (filteredWaypoints.length > 0) {
      addAllWaypoints(userId, filteredWaypoints, callback);
    } else {
      callback(null, []);
    }
  });
};

var getWaypoints = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT location, user_id FROM waypoints WHERE user_id = $1;';
  var params = [userId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }

    // Convert the database format into the format used in the frontend
    for ( var i = 0; i < result.rows.length; i++ ) {
      result.rows[i] = ([result.rows[i].location.x, result.rows[i].location.y]);
    }
    callback(null, result.rows);
  });
};

module.exports = {
  addWaypoints: addUniqueWaypoints,
  getWaypoints: getWaypoints
};
