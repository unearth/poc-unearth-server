var dbHelpers = require('../database/dbHelpers.js');
var waypointsHelpers = require('../database/dbWaypointsHelpers.js');
var userHelpers = require('../database/dbUserHelpers.js');

module.exports = function(app, authController) {


  ////////////////////
  // INVITE ROUTES

  // Invites a user to a group, using a groupID and the receiver email
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

        // Invites a user to a group
        dbHelpers.inviteUserToGroup(request.body.groupId, senderId, receiverId, function(error) {
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

      dbHelpers.deleteInvite(user_id, request.body.groupId, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        dbHelpers.addToGroup(user_id, request.body.groupId, function(error) {
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

      dbHelpers.deleteInvite(user.user_id, request.body.groupID, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        response.status(200).json({success: 'Group request has been declined!'});
      });
    });
  });

  // Returns all of a user's outstanding invitations
  app.get('/invites', authController.tokenAuth, function(request, response) {
    var groups = [];
    var outstandingInvites = [];

    // Gets outstanding invites' groupId and senderIds
    dbHelpers.outstandingInvites(request.unearth.token, function(error, invites) {
      if (error) { return response.status(500).json({error: error}); }
      if (!invites ) { return response.status(410).json({error: 'There are no outstanding invites!' });}

      // If there are invites, loops through each and returns the group name/description for each
      if (invites.length > 0) {
        for (var i = 0; i < invites.length; i++) {

          (function(i){
            dbHelpers.groupInformation(invites[i].group_id, function (error, info, groupId) {
              if (error) { return response.status(500).json({error: error}); }
              if (!info) { return response.status(500).json({error: 'There are no groups!' });}

              outstandingInvites.push([invites[i], info]);

              if (i === invites.length-1) {
                groups.push({outstandingInvites: outstandingInvites});
                response.status(200).json({groups: groups});
              }
            });
          })(i);
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
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }
      var senderId = user.user_id;

      // Creates a group
      dbHelpers.createGroup(request.body.groupName, request.body.groupDescription,  function(error, group) {
        if (error) { return response.status(500).json({error: error}); }
        var groupId = group.group_id;

        // Invites a user to the group
        var inviteUser = function(error, user) {
          if (error) { return response.status(500).json({error: error}); }
          if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }

          dbHelpers.inviteUserToGroup(groupId, senderId, user.user_id, function(error) {
            if (error) { return response.status(500).json({error: error}); }
          });
        };

        for (var i = 0; i < request.body.emails.length; i++) {
          userHelpers.getUser(request.body.emails[i], 'email', inviteUser);
        }

        dbHelpers.addToGroup(senderId, groupId, function(error, groupId) {
          if (error) { return response.status(500).json({error: error}); }
          response.status(200).json({groupId: groupId});
        });
      });
    });
  });

  app.get('/', authController.tokenAuth, function(request, response) {

    // Queries database for user's groups - works
    dbHelpers.groupListing(request.unearth.token, function(error, groups) {
      if (error) { throw error; }
      if (!groups) { throw error; }
      var done = false;
      if (groups.length === 0){ response.status(200).send('no groups'); }
      else {
        for (var i = 0; i < groups.length; i++ ) {

          (function(i){
            dbHelpers.groupInformation(groups[i].group_id, function(error, groupInfo) {
              if(error){ throw error; }
              groups[i].name = groupInfo[0].name;
              groups[i].description = groupInfo[0].description;

              // Get the Group Members
              dbHelpers.groupMembers(groups[i].group_id, i, function(error, membersIds, groupId, i) {
                if (error) { throw error; }
                if (!membersIds) { throw error; }

                for (var j = 0; j < membersIds.length; j++) {
                  (function(i, j){
                    userHelpers.getUser(membersIds[j].user_id, 'user_id', function(error, member) {
                      if (error) { throw error; }

                      if(member){
                        groups[i].members = groups[i].members || [];
                        if(member.password !== undefined){ delete member.password; }
                        if(member.token !== undefined){ delete member.token; }
                        groups[i].members.push(member);
                      }

                      if( (i === groups.length-1) && (j === membersIds.length -1) ){
                        if(done){ response.status(200).json({groups: groups}); }
                        else{ done = true; }
                      }
                    });
                  })(i, j);
                }
              });

              // Get the Pending Members
              dbHelpers.pendingGroupMembers(groups[i].group_id, i, function(error, pendingMembersIds, groupId, i) {
                if (error) { throw error; }
                if (!pendingMembersIds) { throw error; }

                for (var p = 0; p < pendingMembersIds.length; p++) {
                  (function(i, p){

                    userHelpers.getUser(pendingMembersIds[p].receiver_id, 'user_id', function(error, pendingMember) {
                      if (error) { throw error; }
                      if(pendingMember){
                        groups[i].pendingMembers = groups[i].pendingMembers || [];
                        if(pendingMember.password !== undefined){ delete pendingMember.password; }
                        if(pendingMember.token !== undefined){ delete pendingMember.token; }
                        groups[i].pendingMembers.push(pendingMember);
                      }
                      if( (i === groups.length-1) && (p === pendingMembersIds.length - 1)  ){
                        if(done){ response.status(200).json({groups: groups}); }
                        else{ done = true; }
                      }
                    });
                  })(i, p);
                }
              });
            });
          })(i);
        }
      }
    });
  });

  app.get('/waypoints', authController.tokenAuth, function(request, response) {

    dbHelpers.groupMembers(parseInt(request.headers.groupid), null, function(error, members, groupId) {
      if (error) { return response.status(500).json({error: error}); }
      if (!members) { return response.status(409).json({error: 'There are no group members!' });}
      if (members.length > 0) {
        for (var i = 0; i < members.length; i++) {

          (function(i){
            waypointsHelpers.getWaypoints(members[i].user_id, function(error, waypoints) {
              if (error) { return response.status(500).json({error: error}); }
              if (!waypoints) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }

              members[i].waypoints = waypoints;

              if (i === members.length - 1) {
                response.status(200).json({waypoints: members});
              }
            });
          })(i);
        }
      } else {
        response.status(200).json({waypoints: members});
      }
    });
  });
};

