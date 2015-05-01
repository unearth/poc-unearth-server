var dbUtils = require('./dbUtils');

////////////////////////
// WAYPOINT ROUTES

module.exports.addWaypoint = function(userId, longitude, latitude, callback) {
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

////////////////////////
// ACCOUNT CREATION

module.exports.addUser = function(username, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into users (username)" + "VALUES ('" + dbUtils.sanitize(username) + "');";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);  // runs `callback(null, rows);` on success
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


////////////////////////
// LOCAL AUTH

module.exports.addLocalAccount = function(userId, email, password, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into local_auth (user_id, email, password)" +
  "VALUES ('" + userId + "','" + email + "','" + password + "');";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.getLocalAccount = function(username, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT users.user_id, " +
  "users.user_id, users.username, local_auth.email, local_auth.password " +
  "FROM local_auth INNER JOIN users " +
  "ON local_auth.user_id = users.user_id " +
  "WHERE users.username = '" + username + "';";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};


////////////////////////
// FACEBOOK AUTH

module.exports.addFacebookAccount = function(facebookId, userId, token, email, name, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into facebook_auth (facebook_id, user_id, token, email, name)" +
  "VALUES ('" + facebookId + "','" + userId + "','" + token + "','" + email + "','" + name + "');";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.getFacebookAccount = function(facebookId, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT users.user_id, " +
  "facebook_auth.facebook_id, facebook_auth.token, facebook_auth.email, facebook_auth.name " +
  "FROM facebook_auth INNER JOIN users " +
  "ON facebook_auth.user_id = users.user_id " +
  "WHERE facebook_auth.facebook_id = '" + facebookId + "';";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};


////////////////////////
// GOOGLE AUTH

module.exports.addGoogleAccount = function(googleId, userId, token, email, name, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into google_auth (google_id, user_id, token, email, name)" +
  "VALUES ('" + googleId + "','" + userId + "','" + token + "','" + email + "','" + name + "');";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.getGoogleAccount = function(googleId, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT users.user_id, " +
  "google_auth.google_id, google_auth.token, google_auth.email, google_auth.name " +
  "FROM google_auth INNER JOIN users " +
  "ON google_auth.user_id = users.user_id " +
  "WHERE google_auth.google_id = '" + googleId + "';";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};


////////////////////////
// TWITTER AUTH
//

module.exports.addTwitterAccount = function(twitterId, userId, token, displayName, username, callback) {
  callback = callback || function(value){ return value; };
  var query = "INSERT into twitter_auth (twitter_id, user_id, token, display_name, username)" +
  "VALUES ('" + twitterId + "','" + userId + "','" + token + "','" + displayName + "','" + username + "');";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};

module.exports.getTwitterAccount = function(twitterId, callback) {
  callback = callback || function(value){ return value; };
  var query = "SELECT users.user_id, " +
  "twitter_auth.twitter_id, twitter_auth.token, twitter_auth.display_name, twitter_auth.username " +
  "FROM twitter_auth INNER JOIN users " +
  "ON twitter_auth.user_id = users.user_id " +
  "WHERE twitter_auth.twitter_id = '" + twitterId + "';";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};


////////////////////////
// UTILITY ROUTES

module.exports.clearTables = function(callback) {
  callback = callback || function(value){ return value; };
  var query = "TRUNCATE users RESTART IDENTITY CASCADE";
  dbUtils.makeQuery(query, function(error, rows){
    dbUtils.handleErrors(error, rows, callback);
  });
};



