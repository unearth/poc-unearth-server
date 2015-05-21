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
// GROUP ROUTES

var inviteUserToGroup = function(groupId, senderId, receiverId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT INTO group_pending (group_id, sender_id, receiver_id) VALUES ($1, $2, $3);';
  var params = [groupId, senderId, receiverId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var deleteInvite = function(userId, groupId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'DELETE FROM group_pending WHERE receiver_id = $1 AND group_id = $2;';
  var params = [userId, groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var addToGroup = function(userId, groupId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT INTO group_join (user_id, group_id) VALUES ($1, $2) RETURNING $2;';
  var params = [userId, groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var groupId = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null, groupId);
  });
};

var createGroup = function(groupName, groupDescription, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING group_id;';
  var params = [groupName, groupDescription];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var groupId = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null, groupId);
  });
};

var groupListing = function(token, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT group_id FROM group_join WHERE user_id = (SELECT user_id FROM users WHERE token = $1);';
  var params = [token];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var group = (result && result.rows) ? result.rows : null;
    callback(null, group);
  });
};

var groupMembers = function(groupId, i, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT user_id FROM group_join WHERE group_id = $1';
  var params = [groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var group = (result && result.rows) ? result.rows : null;
    callback(null, group, groupId, i);
  });
};

var pendingGroupMembers = function(groupId, i, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT receiver_id FROM group_pending WHERE group_id = $1';
  var params = [groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var pendingGroup = (result && result.rows) ? result.rows : null;
    callback(null, pendingGroup, groupId, i);
  });
};

var outstandingInvites = function(token, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT group_id, sender_id FROM group_pending WHERE receiver_id = (SELECT user_id FROM users WHERE token = $1);';
  var params = [token];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var pendingInvites = (result && result.rows) ? result.rows : null;
    callback(null, pendingInvites);
  });
};

var groupInformation  = function(groupId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT name, description FROM groups WHERE group_id = $1';
  var params = [groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var group = (result && result.rows) ? result.rows : null;
    callback(null, group);
  });
};

// userData === {token, userId, email}
var memberUser = function(user_id, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT user_id, email, name FROM users WHERE user_id = $1;';
  var params = [user_id];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var user = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null,  user);
  });
};

// userData === {token, userId, email}
var pendingUser = function(userData, dataType, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT user_id, email, name FROM users WHERE user_id = $1;';
  var params = [user_id];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var user = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null,  user);
  });
};


////////////////////////
// UTILITY ROUTES

var clearTables = function(callback) {
  callback = callback || function(value) { return value; };
  var query = 'TRUNCATE users RESTART IDENTITY CASCADE;';

  dbUtils.makeQuery(query, [], function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};


module.exports = {
  clearTables: clearTables,
  inviteUserToGroup: inviteUserToGroup,
  deleteInvite: deleteInvite,
  addToGroup: addToGroup,
  createGroup: createGroup,
  groupListing: groupListing,
  groupMembers: groupMembers,
  pendingGroupMembers: pendingGroupMembers,
  outstandingInvites: outstandingInvites,
  groupInformation: groupInformation,
  memberUser: memberUser,
  pendingUser: pendingUser
};
