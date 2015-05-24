var dbUserHelpers = require('../database/dbUserHelpers.js');
var dbGroupHelpers = require('../database/dbGroupHelpers.js');
var dbWaypointsHelpers = require('../database/dbWaypointsHelpers.js');

module.exports = function(app, authController) {

  ////////////////////
  // INVITE ROUTES

  // Invites a user to a group, using a groupID and the receiver email
  app.post('/invite', authController.tokenAuth, function(request, response) {

    // Gets sender data
    dbUserHelpers.getUser(request.unearth.token, 'token', function(error, sender) {
      if (error) { return response.status(500).json({error: 'Sender could not be located.'}); }
      if (!sender) { return response.status(409).json({error: 'Sender doesn\'t exist.' }); }
      var senderId = sender.user_id;

      // Gets receiver data
      dbUserHelpers.getUser(request.body.email, 'email', function(error, receiver) {
        if (error) { return response.status(500).json({error: 'Receiver could not be located.'}); }
        if (!receiver) { return response.status(409).json({error: 'Receiver doesn\'t exist.' }); }
        var receiverId = receiver.user_id;

        // Invites a user to a group
        dbGroupHelpers.inviteUserToGroup(request.body.groupId, senderId, receiverId, function(error) {
          if (error) {return response.status(500).json({error: 'User could not be invited.'}); }
          response.status(200).json({success: 'Group request has been sent!'});
        });
      });
    });
  });

  // Accepts an invite, adds user to group, and removes user from pending invites
  app.post('/accept', authController.tokenAuth, function(request, response) {
    dbUserHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: 'User could not be located.'}); }
      if (!user) { return response.status(409).json({error: 'User doesn\'t exist.' }); }

      // Deletes the invitation from the invitation table
      dbGroupHelpers.deleteInvite(user.user_id, request.body.groupId, function(error) {
        if (error) { return response.status(500).json({error: '1: Invitation could not be accepted.'}); }

        // Adds a user to the group
        dbGroupHelpers.addToGroup(user.user_id, request.body.groupId, function(error) {
          if (error) { return response.status(500).json({error: '2: Invitation could not be accepted.'}); }
          response.status(200).json({success: 'Group request has been accepted!'});
        });
      });
    });
  });

  // Denies a group invite, removes invited user from pending invites table
  app.post('/deny', authController.tokenAuth, function(request, response) {
    dbUserHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: 'User could not be located.'}); }
      if (!user) { return response.status(409).json({error: 'User doesn\'t exist.' }); }

      // Deletes the invitation from the invitation table
      dbGroupHelpers.deleteInvite(user.user_id, request.body.groupId, function(error) {
        if (error) { return response.status(500).json({error: '1: Invitation could not be declined.' }); }
        response.status(200).json({success: 'Group request has been declined!'});
      });
    });
  });

  // Returns all of a user's outstanding invitations
  app.get('/invites', authController.tokenAuth, function(request, response) {
    var groups = [];
    var outstandingInvites = [];

    // Gets outstanding invites' groupId and senderIds
    dbGroupHelpers.outstandingInvites(request.unearth.token, function(error, invites) {
      if (error) { return response.status(500).json({error: 'Outstanding invites could not be located'}); }
      if (!invites ) { return response.status(410).json({error: 'There are no existing outstanding invites.' });}

      // Gets the invitations from a single group
      var getInvites = function(i){
        dbGroupHelpers.groupInformation(invites[i].group_id, function (error, info, groupId) {
          if (error) { return response.status(500).json({error: 'Group could not be located'}); }
          if (!info) { return response.status(500).json({error: 'There are no groups!' });}

          outstandingInvites.push([invites[i], info]);
          if (i === invites.length-1) {
            groups.push({outstandingInvites: outstandingInvites});
            response.status(200).json({groups: groups});
          }
        });
      };

      // If there are invites, loops through each and returns the group name/description for each
      if (invites.length > 0) {
        for (var i = 0; i < invites.length; i++) {
          getInvites(i);
        }
      } else {
        response.status(200).json({groups: groups});
      }
    });
  });


  ////////////////////
  // GROUP ROUTES

  // Creates a group and stores it to the database
  app.post('/create', authController.tokenAuth, function(request, response) {
    dbUserHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: 'User could not be located.'}); }
      if (!user) { return response.status(409).json({error: 'User doesn\'t exist.' }); }
      var senderId = user.user_id;

      // Creates a group
      dbGroupHelpers.createGroup(request.body.groupName, request.body.groupDescription,  function(error, groupId) {
        if (error) { return response.status(500).json({error: 'Group could not be created.'}); }

        // Invites a user to the group
        var inviteUser = function(error, user) {
          if (error) { return response.status(500).json({error: 'User could not be located.'}); }
          if (!user) { return response.status(409).json({error: 'User doesn\'t exist.' }); }

          dbGroupHelpers.inviteUserToGroup(groupId, senderId, user.user_id, function(error) {
            if (error) { return response.status(500).json({error: 'User could not be invited.'}); }
          });
        };

        for (var i = 0; i < request.body.emails.length; i++) {
          dbUserHelpers.getUser(request.body.emails[i], 'email', inviteUser);
        }

        dbGroupHelpers.addToGroup(senderId, groupId, function(error) {
          if (error) { return response.status(500).json({error: 'User could not be added to group.'}); }
          response.status(200).json({groupId: groupId});
        });
      });
    });
  });

  app.get('/', authController.tokenAuth, function(request, response) {

    // Queries database for user's groups
    dbGroupHelpers.groupListing(request.unearth.token, function(error, groups) {
      if (error) { throw error; }
      if (!groups) { throw error; }
      var done = false;
      if (groups.length === 0){
        response.status(200).send('no groups');
      } else {
        // Gets all the information for a group member
        var getMembers = function(i, j, userId, membersIds, memberType) {
          dbUserHelpers.getUser(userId, 'user_id', function(error, member) {
            if (error) { throw error; }

            if(member){
              groups[i][memberType] = groups[i][memberType] || [];
              if(member.password !== undefined){ delete member.password; }
              if(member.token !== undefined){ delete member.token; }
              groups[i][memberType].push(member);
            }
            if( (i === groups.length-1) && (j === membersIds.length - 1) ){
              if(done){ response.status(200).json({groups: groups}); }
              else{ done = true; }
            }
          });
        };

        // Gets all the user information for a single group
        var getGroup = function(i) {
          dbGroupHelpers.groupInformation(groups[i].group_id, function(error, groupInfo) {
            if(error){ throw error; }
            groups[i].name = groupInfo[0].name;
            groups[i].description = groupInfo[0].description;

            // Gets the current members
            dbGroupHelpers.groupMembers(groups[i].group_id, function(error, membersIds, groupId) {
              if (error) { throw error; }
              if (!membersIds) { throw error; }
              if (membersIds.length === 0){ done = true; }
              for (var j = 0; j < membersIds.length; j++) {
                getMembers(i,j, membersIds[j].user_id, membersIds, "members");
              }
            });

            // Gets the pending members
            dbGroupHelpers.pendingGroupMembers(groups[i].group_id, i, function(error, pendingMembersIds, groupId, i) {
              if (error) { throw error; }
              if (!pendingMembersIds) { throw error; }
              if (pendingMembersIds.length === 0){ done = true; }
              for (var j = 0; j < pendingMembersIds.length; j++) {
                getMembers(i,j, pendingMembersIds[j].receiver_id, pendingMembersIds, "pendingMembers");
              }
            });
          });
        };

        // Get the information for all of a user's groups
        for (var i = 0; i < groups.length; i++ ) {
          getGroup(i);
        }
      }
    });
  });

  app.get('/waypoints', authController.tokenAuth, function(request, response) {

    dbGroupHelpers.groupMembers(parseInt(request.headers.groupid), null, function(error, members, groupId) {
      if (error) { return response.status(500).json({error: error}); }
      if (!members) { return response.status(409).json({error: 'There are no group members!' });}
      if (members.length > 0) {

        var getWaypoints = function(i) {
          dbWaypointsHelpers.getWaypoints(members[i].user_id, function(error, waypoints) {
            if (error) { return response.status(500).json({error: error}); }
            if (!waypoints) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }

            members[i].waypoints = waypoints;

            if (i === members.length - 1) {
              response.status(200).json({waypoints: members});
            }
          });
        };

        for (var i = 0; i < members.length; i++) {
          getWaypoints(i);
        }

      } else {
        response.status(200).json({waypoints: members});
      }
    });
  });
};

