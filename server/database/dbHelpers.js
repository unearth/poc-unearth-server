var dbUtils = require('./dbUtils');

////////////////////////
// UTILITY ROUTES

var clearTables = function(callback) {
  callback = callback || function(value) { return value; };
  var query = 'TRUNCATE users RESTART IDENTITY CASCADE;';

  dbUtils.makeQuery(query, [], function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var query = 'TRUNCATE groups RESTART IDENTITY CASCADE;';

    dbUtils.makeQuery(query, [], function(error, result) {
      if (error) { return dbUtils.handleError(error, callback); }
      callback(null, result);
    });
  });
};


module.exports = {
  clearTables: clearTables
};
