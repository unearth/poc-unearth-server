var dbUtils = require('./dbUtils');

module.exports.insertUser = function(username, password, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into users (username)" + "VALUES ('" + dbUtils.sanitize(username) + "','" + dbUtils.sanitize(password) + "');";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
    // runs `callback(null, rows);` on success
  });
};

module.exports.getUser = function(username, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT * FROM users WHERE username = '" + username + "';";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.deleteUser = function(userId, callback) {
  callback = callback || function(value){ return value; };
  var waypointQuery = "DELETE FROM users WHERE user_id = " + userId + ";";
  dbUtils.makeQuery(waypointQuery, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.insertWaypoint = function(userId, longitude, latitude, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into waypoints (user_id, longitude, latitude)" + "VALUES ('" + userId + "','" + longitude + "','" + latitude + "');";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.getWaypoints = function(userId, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT * FROM waypoints WHERE user_id = '" + userId + "';";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.clearTables = function(callback) {
  callback = callback || function(value){ return value; };
  var query = "TRUNCATE users RESTART IDENTITY CASCADE";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};
