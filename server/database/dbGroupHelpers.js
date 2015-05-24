var dbUtils = require('./dbUtils');

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
    if(result.rowCount === 0){ return callback(error); }
    callback(null, result);
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
    callback(null, groupId.group_id);
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

var groupMembers = function(groupId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT user_id FROM group_join WHERE group_id = $1';
  var params = [groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { return dbUtils.handleError(error, callback); }
    var group = (result && result.rows) ? result.rows : null;
    callback(null, group, groupId);
  });
};


module.exports = {
  inviteUserToGroup: inviteUserToGroup,
  deleteInvite: deleteInvite,
  addToGroup: addToGroup,
  createGroup: createGroup,
  groupListing: groupListing,
  groupMembers: groupMembers,
  pendingGroupMembers: pendingGroupMembers,
  outstandingInvites: outstandingInvites,
  groupInformation: groupInformation
};
