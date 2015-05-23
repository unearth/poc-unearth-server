var dbUtils = require('./dbUtils');

////////////////////////
// USERS

var dbUtils = require('./dbUtils');

var addUser = function(email, name, password, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT into users (email, name, password) VALUES ($1, $2, $3) RETURNING *;';
  var params = [email, name, password];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var user = (result && result.rows) ? result.rows[0] : null;
    callback(null, user);
  });
};

// userData === {token, userId, email}
var getUser = function(userData, dataType, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT * FROM users WHERE ' + dataType + ' = $1;';
  var params = [userData];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var user = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null,  user);
  });
};

var deleteUser = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'DELETE FROM users WHERE user_id = $1;';
  var params = [userId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
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
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var deleteToken = function(token, callback) {
  callback = callback || function(value) { return value; };
  var query = 'UPDATE users SET token = $1 WHERE token = $2;';
  var params = [null, token];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

module.exports = {
  addUser: addUser,
  getUser: getUser,
  deleteUser: deleteUser,
  addToken: addToken,
  deleteToken: deleteToken
};
