var dbHelpers = require('../database/dbHelpers.js');
var groupHelpers = require('../database/groupHelpers.js');
var waypointHelpers = require('../database/waypointHelpers.js');

module.exports = function(app, authController) {

  // Invites a user to a group (using a groupID and the invited person's email)
  app.post('/invite', authController.tokenAuth, function(request, response) {

    // Gets sender data
    userHelpers.getUser(request.unearth.token, 'token', function(error, sender) {
      if (error) { return response.status(500).json({error: error}); }
      if (!sender) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }
      var senderId = sender.user_id;

      // Gets receiver data
      userHelpers.getUser(request.body.email, 'email', function(error, receiver) {
        if (error) { return response.status(500).json({error: error}); }
        if (!receiver) { return response.status(409).json({error: 'This isn\'t an existing receiver!' }); }
        var receiverId = receiver.user_id;

        groupHelpers.inviteUserToGroup(request.body.groupId, senderId, receiverId, function(error) {
          if (error) {return response.status(500).json({error: error}); }
          response.status(200).json({success: 'Group request has been sent!'});
        });
      });
    });
  });

  // Accepts an invite, adds user to group, and removes user from pending invites
  app.post('/accept', authController.tokenAuth, function(request, response) {
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }
      var user_id = user.user_id;
      console.log(user_id);

      groupHelpers.deleteInvite(user_id, request.body.groupId, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        groupHelpers.addToGroup(user_id, request.body.groupId, function(error) {
          if (error) { return response.status(500).json({error: error}); }
          response.status(200).json({success: 'Group request has been accepted!'});
        });
      });
    });
  });

  // Denies a group invite, removes invited user from pending invites table
  app.post('/deny', authController.tokenAuth, function(request, response) {
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }

      groupHelpers.deleteInvite(user.user_id, request.body.groupID, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        response.status(200).json({success: 'Group request has been declined!'});
      });
    });
  });

  // Creates a group with token (sender_id - added to group), groupName, groupDescription, and email (receiver_id)
  app.post('/create', authController.tokenAuth, function(request, response) {
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }
      var senderId = user.user_id;

      groupHelpers.createGroup(request.body.groupName, request.body.groupDescription,  function(error, group) {
        if (error) { return response.status(500).json({error: error}); }
        var groupId = group.group_id;

        var inviteUser = function(error, user) {
          if (error) { return response.status(500).json({error: error}); }
          if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }

          groupHelpers.inviteUserToGroup(groupId, senderId, user.user_id, function(error) {
            if (error) { return response.status(500).json({error: error}); }
            console.log('Group request has been sent!');
          });
        };

        for (var i = 0; i < request.body.emails.length; i++) {
          userHelpers.getUser(request.body.emails[i], 'email', inviteUser);
        }
        groupHelpers.addToGroup(senderId, groupId, function(error) {
          if (error) { return response.status(500).json({error: error}); }
          response.status(200).json({success: 'Group has been created!'});
        });
      });
    });
  });


  app.get('/', authController.tokenAuth, function(request, response) {
    var memberGroups = [];
    var outstandingInvites = [];
    var j;

    // Queries database for user's groups - works
    groupHelpers.groupListing(request.unearth.token, function(error, groups) {
      if (error) { return response.status(500).json({error: error}); }
      if (!groups) { return response.status(409).json({error: 'There are no groups!' });}

      memberGroups.push(groups);

    });

    if (memberGroups.length > 0) {

      for (var i = 0; i < groups.length; i++ ) {

        groupHelpers.groupMembers(groups[i].group_id, i, function(error, membersIds, groupId, i) {
          if (error) { return response.status(500).json({error: error}); }
          if (!membersIds) { return response.status(409).json({error: 'There are no group members!' });}
          memberGroups[i].membersIds = membersIds;
        });

        if (memberGroups[i].membersIds.length > 0) {
          for (var j = 0; j < memberGroups[i].membersIds.length; j++) {
            groupHelpers.memberUser(memberGroups[i].membersIds[j].user_id, function(error, members) {
              if (error) { return response.status(500).json({error: error}); }
                if (!members) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }
                  memberGroups[i].membersIds[j].memberDetails = members;
              });
            }
          }

        groupHelpers.pendingGroupMembers(groups[i].group_id, i, function(error, pendingMembersIds, groupId, i) {
          if (error) { return response.status(500).json({error: error}); }
          if (!pendingMembersIds) { return response.status(409).json({error: 'There are no group members!' });}
          memberGroups[i].pendingMembersIds = pendingMembersIds;
        });

        if (memberGroups[i].pendingMembersIds.length > 0) {
          for (var p = 0; p < memberGroups[i].pendingMembersIds.length; p++) {
            groupHelpers.memberUser(memberGroups[i].pendingMembersIds[p].user_id, function(error, members) {
              if (error) { return response.status(500).json({error: error}); }
              if (!members) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }
                  memberGroups[i].pendingMembersIds[p].memberDetails = members;
            });
          }
        }

      }
    }
    response.status(200).json({memberGroups: memberGroups});
  });

  app.get('/invites', authController.tokenAuth, function(request, response) {
    var groups = [];
    var outstandingInvites = [];

    // Gets outstanding invites' groupId and senderId - works
    groupHelpers.outstandingInvites(request.unearth.token, function(error, invites) {
      if (error) { return response.status(500).json({error: error}); }
      if (!invites ) { return response.status(409).json({error: 'There are no outstanding invites!' });}
      // Loop through invites/groupId, get group name/description for each
      if (invites.length > 0) {
        for (var j = 0; j < invites.length; j ++) {

          groupHelpers.groupInformation(invites[j].group_id, j, function (error, info, groupId, j) {
            if (error) { return response.status(500).json({error: error}); }
            if (!info) { return response.status(409).json({error: 'There are no groups!' });}

              outstandingInvites.push([invites[j], info]);
              console.log('outstandinIs', outstandingInvites);

          if (j === invites.length-1) {
            console.log(outstandingInvites);
            groups.push({outstandingInvites: outstandingInvites});
            response.status(200).json({groups: groups});
          }
          });
        }
      } else {
        response.status(200).json({groups: groups});
      }
    });
  });


  app.get('/waypoints', authController.tokenAuth, function(request, response) {
    var membersGroup = [];

    groupHelpers.groupMembers(parseInt(request.headers.groupid), null, function(error, members, groupId) {
      if (error) { return response.status(500).json({error: error}); }
      if (!members) { return response.status(409).json({error: 'There are no group members!' });}
      if (members.length > 0) {
        membersGroup.push(members);
        console.log(membersGroup);
        for (var i = 0; i < membersGroup[0].length; i++) {
          waypointHelpers.getWaypoints(membersGroup[0][i].user_id, function(error, i, waypoints) {

            // in the console log below, i = 2, membersGroup[0][0] = undefined, and waypoints are correct
            console.log('i', i, membersGroup[0][0], 'membersGroup', waypoints);
            if (error) { return response.status(500).json({error: error}); }
            if (!waypoints) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }
            var member = [];
            membersGroup[0][i].waypoints = waypoints;
            console.log(members);
          });
        }
      } //else

    });

  });

};

