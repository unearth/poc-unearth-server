var pg = require('pg');
var connectionString = require('../config.js').db.databaseUrl;

// Opens a new database connection
var client = new pg.Client(connectionString);
client.connect( function(error) {
  if (error) {
    throw error;
  }
});

// Handles any database errors
module.exports.handleError = function(error, callback) {
  if(error) {
    callback(error);
    return;
  }
};

module.exports.makeQuery = function(queryString, parameters, callback) {
  client.query(queryString, parameters, function(error, result) {
    if(error) {
      return callback(error, null);
    } else {
      callback(null, result);
    }
  });
};
