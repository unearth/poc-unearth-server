////////////////////////
// USERS

var dbUtils = require('./dbUtils');

var addUser = function(email, password, callback) {
  callback = callback || function(value) { return value; };
  var query = "INSERT into users (email, password)" + "VALUES ($1, $2);";
  var params = [email, password];

  dbUtils.makeQuery(query, params, function(error) {
    if (error) { dbUtils.handleError(error, callback); }
    getUser(email, 'email', callback);
  });
};

// userData will be a token, a userId, or an email
var getUser = function(userData, dataType, callback) {
  callback = callback || function(value) { return value; };
  var query = "SELECT * FROM users WHERE " + dataType + " = $1;";
  var params = [userData];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var user = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null,  user);
  });
};

var deleteUser = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = "DELETE FROM users WHERE user_id = $1;";
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
  var query = "UPDATE users SET token = $1 WHERE user_id = $2;";
  var params = [token, userId];
  console.log(token);
  console.log(userId);
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var deleteToken = function(token, callback) {
  callback = callback || function(value) { return value; };
  var query = "UPDATE users SET token = $1 WHERE token = $2;";
  var params = [null, token];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

////////////////////////
// WAYPOINT ROUTES

var addWaypoint = function(userId, latitude, longitude, callback) {
  callback = callback || function(value) { return value; };
  var query = "INSERT into waypoints (user_id, latitude, longitude)" + "VALUES ($1,$2,$3);";
  var params = [userId, latitude, longitude];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var getWaypoints = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = "SELECT latitude, longitude FROM waypoints WHERE user_id = $1;";
  var params = [userId];
  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result.rows);
  });
};

////////////////////////
// UTILITY ROUTES

var clearTables = function(callback) {
  callback = callback || function(value) { return value; };
  var query = "TRUNCATE users RESTART IDENTITY CASCADE";
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
  addWaypoint: addWaypoint,
  getWaypoints: getWaypoints,
  clearTables: clearTables
};
