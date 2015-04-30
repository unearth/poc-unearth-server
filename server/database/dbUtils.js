var pg = require('pg');
var connectionString = process.env.DATABASE_URL || "postgres://ben:@localhost:5432/unearth";

module.exports.sanitize = function(string) {
  return string.replace(/'/g,"''");
};

module.exports.handleErrors = function(error, rows, callback){
  if(error) {
    callback(error);
    return;
  }
  callback(null, rows);
};

module.exports.makeQuery = function(queryString, callback) {
  pg.connect(connectionString, function(connectionError, connection, done) {
    if(connectionError){
      callback(connectionError, null);
    }
    connection.query(queryString, function(queryError, result) {
      if(queryError) {
        return callback(queryError, null);
      } else {
        callback(null, result.rows);
      }
    });
  });
};
