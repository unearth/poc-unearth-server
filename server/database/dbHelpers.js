////////////////////////
// USERS

var dbUtils = require('./dbUtils');

var addUser = function(email, password, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT into users (email, password) VALUES ($1, $2);';
  var params = [email, password];

  dbUtils.makeQuery(query, params, function(error) {
    if (error) { dbUtils.handleError(error, callback); }
    getUser(email, 'email', callback);
  });
};

// userData is a token, a userId, or an email
var getUser = function(userData, dataType, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT * FROM users WHERE ' + dataType + ' = $1;';
  var params = [userData];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var user = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null,  user);
  });
};

var deleteUser = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'DELETE FROM users WHERE user_id = $1;';
  var params = [userId];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var user = (result && result.rows) ? result.rows[0] : null;
    callback(null, user);
  });
};

////////////////////////
// TOKEN ROUTES

var addToken = function(token, userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'UPDATE users SET token = $1 WHERE user_id = $2;';
  var params = [token, userId];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var deleteToken = function(token, callback) {
  callback = callback || function(value) { return value; };
  var query = 'UPDATE users SET token = $1 WHERE token = $2;';
  var params = [null, token];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

////////////////////////
// WAYPOINT ROUTES

var addWaypoints = function(userId, waypoints, callback) {
  callback = callback || function(value) { return value; };
  var query = "INSERT into waypoints (user_id, location) VALUES";
  var params = [userId];

  // Loops through the location array and adds them to the query string
  for (var i = 0; i < waypoints.length; i++) {

    // Prepares the query string and params array for multiple inserts at the same time
    // waypoints[i][0] === latitude
    // waypoints[i][1] === longitude
    params.push(waypoints[i][0], waypoints[i][1]);
    query = query + (' ($1' + ',POINT($' + (i*2 + 2) + ',$' + (i*2 + 3) + '))');
    console.log(query);
    // Adds a comma or semicolon at the end depending on whether the string is ending
    query += (i === waypoints.length - 1) ? ';' : ',';
  }

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var getWaypoints = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT location FROM waypoints WHERE user_id = $1;';
  var params = [userId];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }

    // Convert the database format into the format used in the frontend
    for ( var i = 0; i < result.rows.length; i++ ) {
      result.rows[i] = ([result.rows[i].location.x, result.rows[i].location.y]);
    }

    callback(null, result.rows);
  });
};

////////////////////////
// UTILITY ROUTES

var clearTables = function(callback) {
  callback = callback || function(value) { return value; };
  var query = 'TRUNCATE users RESTART IDENTITY CASCADE;';
  dbUtils.makeQuery(query, [], function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};


module.exports = {
  addUser: addUser,
  getUser: getUser,
  deleteUser: deleteUser,
  addToken: addToken,
  deleteToken: deleteToken,
  addWaypoints: addWaypoints,
  getWaypoints: getWaypoints,
  clearTables: clearTables
};
