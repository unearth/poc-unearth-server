////////////////////////
// USERS

var dbUtils = require('./dbUtils');

var addUser = function(email, password, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into users (email, password)" + "VALUES ($1, $2);";
  var params = [email, password];
  dbUtils.makeQuery(query, params, function(error){
    if(error){ dbUtils.handleError(error); }
    getUser(email, callback);
  });
};

var getUser = function(email, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT * FROM users WHERE email = $1;";
  var params = [email];
  dbUtils.makeQuery(query, params, function(error, result){
    if(error){ dbUtils.handleError(error); }
    callback(null, result.rows[0]);
  });
};

var getUserById = function(userId, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT * FROM users WHERE user_id = $1;";
  var params = [userId];
  dbUtils.makeQuery(query, params, function(error, result){
    if(error){ dbUtils.handleError(error); }
    callback(null, result.rows[0]);
  });
};

var deleteUser = function(userId, callback) {
  callback = callback || function(value){ return value; };
  var query = "DELETE FROM users WHERE user_id = $1;";
  var params = [userId];
  dbUtils.makeQuery(query, params, function(error, result){
    if(error){ dbUtils.handleError(error); }
    callback(null, result.rows[0]);
  });
};


////////////////////////
// WAYPOINT ROUTES

var addWaypoint = function(userId, longitude, latitude, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into waypoints (user_id, longitude, latitude)" + "VALUES ($1,$2,$3);";
  var params = [userId, longitude, latitude];
  dbUtils.makeQuery(query, params, function(error, result){
    if(error){ dbUtils.handleError(error); }
    callback(null, result);
  });
};

var getWaypoints = function(userId, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT * FROM waypoints WHERE user_id = $1;";
  var params = [userId];
  dbUtils.makeQuery(query, params, function(error, result){
    if(error){ dbUtils.handleError(error); }
    callback(null, result.rows);
  });
};

////////////////////////
// UTILITY ROUTES

var clearTables = function(callback) {
  callback = callback || function(value){ return value; };
  var query = "TRUNCATE users RESTART IDENTITY CASCADE";
  dbUtils.makeQuery(query, [], function(error, result){
    if(error){ dbUtils.handleError(error); }
    callback(null, result);
  });
};


module.exports = {
  addUser: addUser,
  getUser: getUser,
  getUserById: getUserById,
  deleteUser: deleteUser,
  addWaypoint: addWaypoint,
  getWaypoints: getWaypoints,
  clearTables: clearTables
};
