////////////////////////
// USERS

var dbUtils = require('./dbUtils');

var addUser = function(email, password, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT into users (email, name, password) VALUES ($1, $2) RETURNING *;';
  var params = [email, password];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
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
    if (error) { dbUtils.handleError(error, callback); }
    var user = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null,  user);
  });
};

var deleteUser = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'DELETE FROM users WHERE user_id = $1;';
  var params = [userId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var user = (result && result.rows) ? result.rows[0] : null;
    callback(null, user);
  });
};

////////////////////////
// GROUP ROUTES

var inviteUserToGroup = function(groupId, senderId, receiverId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT INTO group_pending (group_id, sender_id, receiver_id) VALUES ($1, $2, $3);'
  var params = [groupId, senderId, receiverId]

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var deleteInvite = function(userId, groupId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'DELETE FROM group_pending WHERE receiver_id = $1 AND group_id $2;'
  var params = [userId, groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var addToGroup = function(userId, groupId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT INTO group_join (user_id, group_id) VALUES ($1, $2) RETURNING $2;'
  var params = [userId, groupId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var groupId = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null, groupId);
  });
};

var createGroup = function(groupName, groupDescription, callback) {
  callback = callback || function(value) { return value; };
  var query = 'INSERT INTO groups (name, description) VALUES ($1, $2) RETURNING group_id;'
  var params = [groupName, groupDescription];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var groupId = (result && result.rows[0]) ? result.rows[0] : null;
    callback(null, groupId);
  });
};

var groupListing = function(token) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT * FROM groups WHERE group_id = (SELECT group_id FROM group_join WHERE group_id = (SELECT user_id FROM users WHERE token = $1));'
  var params = [token];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var groupId = (result && result.rows) ? result.rows : null;
    callback(null, group);
  });
};

var groupMembers = function(groupId) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT user_id, name, email FROM users WHERE user_id = (SELECT user_id FROM group_join WHERE group_id = $1'
  var params = [group_Id];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var groupId = (result && result.rows) ? result.rows : null;
    callback(null, group);
  });
};

var groupMembersWaypoints = function(groupMembers) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT user_id, name, email FROM users WHERE user_id = (SELECT user_id FROM group_join WHERE group_id = $1'
  var params = [group_Id];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    var groupId = (result && result.rows) ? result.rows : null;
    callback(null, group);
  });
};

// 'SELECT groups.group_id, groups.name, groups.description,
//  group_join.user_id, group_pending.receiver_id, users.email
//  FROM groups
//  INNER JOIN group_join ON groups.group_id = group_join.user_id
//  INNER JOIN group_pending ON groups._group_id = group_pending.receiver_id
//  INNER JOIN users ON group_pending.receiver_id = users.user_id
//  group_join.user_id = user_id'

// POST: invite to group (token, email, GID) - DB: add to group_pending
// POST: accept group invite (token, GID) - DB: return GID
// POST: deny group invite (token, GID)
// POST: create group (token, group name, groupDescription, email) - DB: return GID
// GET: group (token) // GETS: (GID, group name, group desccrip, UIDs, UIDpending)
// //  GET: group waypoints..

////////////////////////
// TOKEN ROUTES

var addToken = function(token, userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'UPDATE users SET token = $1 WHERE user_id = $2;';
  var params = [token, userId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

var deleteToken = function(token, callback) {
  callback = callback || function(value) { return value; };
  var query = 'UPDATE users SET token = $1 WHERE token = $2;';
  var params = [null, token];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

////////////////////////
// WAYPOINT ROUTES

// Adds all passed waypoints into the database.
var addAllWaypoints = function(userId, waypoints, callback) {
  callback = callback || function(value) { return value; };
  var query = "INSERT into waypoints (user_id, location) VALUES";
  var params = [userId];

  // Loops through the waypoints array and adds them to the query string
  for (var i = 0; i < waypoints.length; i++) {

    // Prepares the query string and params array for a mass single insert
    // waypoints[i] === [latitude, longitude]
    params.push(waypoints[i][0], waypoints[i][1]);
    query = query + (' ($1,POINT($' + (i*2 + 2) + ',$' + (i*2 + 3) + '))');

    // Adds a comma or return statement at the end depending on whether the string is ending
    query += (i === waypoints.length - 1) ? 'RETURNING * ;' : ',';
  }

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }
    callback(null, result);
  });
};

// Checks whether waypoints are in the database.
// Uses addAllWaypoints to add waypoints to the database
var addUniqueWaypoints = function(userId, waypoints, callback) {
  callback = callback || function(value) { return value; };
  var query = "SELECT * FROM waypoints where user_id = $1";
  var params = [userId];

  dbUtils.makeQuery(query, params, function(error, result) {

    // Removes any waypoints that already exists on our user's table
    var filteredWaypoints = waypoints.filter( function(item) {
      for(var i = 0; i < result.rows.length; i++) {
        if(result.rows[i].location.x === item[0] && result.rows[i].location.y === item[1]) {
          return false;
        }
      }
      return true;
    });

    // Add waypoints to the database, or callback an empty array if the waypoints already exist
    if (filteredWaypoints.length > 0) {
      addAllWaypoints(userId, filteredWaypoints, callback);
    } else {
      callback(null, []);
    }
  });
};

var getWaypoints = function(userId, callback) {
  callback = callback || function(value) { return value; };
  var query = 'SELECT location FROM waypoints WHERE user_id = $1;';
  var params = [userId];

  dbUtils.makeQuery(query, params, function(error, result) {
    if (error) { dbUtils.handleError(error, callback); }

    // Convert the database format into the format used in the frontend
    for ( var i = 0; i < result.rows.length; i++ ) {
      result.rows[i] = ([result.rows[i].location.x, result.rows[i].location.y]);
    }

    callback(null, result.rows);
  });
};

////////////////////////
// UTILITY ROUTES

var clearTables = function(callback) {
  callback = callback || function(value) { return value; };
  var query = 'TRUNCATE users RESTART IDENTITY CASCADE;';

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
  addWaypoints: addUniqueWaypoints,
  getWaypoints: getWaypoints,
  clearTables: clearTables
};
