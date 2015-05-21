var dbHelpers = require('../database/dbHelpers.js');

module.exports = function(app, authController) {

  // Invites a user to a group (using a groupID and the invited person's email)
  app.post('/invite', authController.tokenAuth, function(request, response) {

    // Gets sender data
    dbHelpers.getUser(request.unearth.token, 'token', function(error, sender) {
      if (error) { return response.status(500).json({error: error}); }
      if (!sender) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }
      var senderId = sender.user_id;

      // Gets receiver data
      dbHelpers.getUser(request.body.email, 'email', function(error, receiver) {
        if (error) { return response.status(500).json({error: error}); }
        if (!receiver) { return response.status(409).json({error: 'This isn\'t an existing receiver!' }); }
        var receiverId = receiver.user_id;

        dbHelpers.inviteUserToGroup(request.body.groupId, senderId, receiverId, function(error) {
          if (error) {return response.status(500).json({error: error}); }
          response.status(200).json({success: 'Group request has been sent!'});
        });
      });
    });
  });

  // Accepts an invite, adds user to group, and removes user from pending invites
  app.post('/accept', authController.tokenAuth, function(request, response) {
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
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
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }

      dbHelpers.deleteInvite(user.user_id, request.body.groupID, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        response.status(200).json({success: 'Group request has been declined!'});
      });
    });
  });

  // Creates a group with token (sender_id - added to group), groupName, groupDescription, and email (receiver_id)
  app.post('/create', authController.tokenAuth, function(request, response) {
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }
      var senderId = user.user_id;

      dbHelpers.createGroup(request.body.groupName, request.body.groupDescription,  function(error, group) {
        if (error) { return response.status(500).json({error: error}); }
        var groupId = group.group_id;

        var inviteUser = function(error, user) {
          if (error) { return response.status(500).json({error: error}); }
          if (!user) { return response.status(409).json({error: 'This isn\'t an existing user!' }); }

          dbHelpers.inviteUserToGroup(groupId, senderId, user.user_id, function(error) {
            if (error) { return response.status(500).json({error: error}); }
            console.log('Group request has been sent!');
          });
        };



        for (var i = 0; i < request.body.emails.length; i++) {
          dbHelpers.getUser(request.body.emails[i], 'email', inviteUser);
        }

        dbHelpers.addToGroup(senderId, groupId, function(error, groupId) {
          if (error) { return response.status(500).json({error: error}); }
          response.status(200).json({groupId: groupId});
        });
      });
    });
  });

  app.get('/', authController.tokenAuth, function(request, response) {
    var groups = [];
    var outstandingInvites = [];

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
              console.log(groupInfo);
              groups[i].name = groupInfo[0].name;
              groups[i].description = groupInfo[0].description;

              // Get the Group Members
              dbHelpers.groupMembers(groups[i].group_id, i, function(error, membersIds, groupId, i) {
                if (error) { throw error; }
                if (!membersIds) { throw error; }

                for (var j = 0; j < membersIds.length; j++) {
                  (function(i, j){
                    dbHelpers.getUser(membersIds[j].user_id, 'user_id', function(error, member) {
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
                    dbHelpers.getUser(pendingMembersIds[p].receiver_id, 'user_id', function(error, pendingMember) {
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


  app.get('/invites', authController.tokenAuth, function(request, response) {
    var groups = [];
    var outstandingInvites = [];

    // Gets outstanding invites' groupId and senderId - works
    dbHelpers.outstandingInvites(request.unearth.token, function(error, invites) {
      if (error) { return response.status(500).json({error: error}); }
      if (!invites ) { return response.status(409).json({error: 'There are no outstanding invites!' });}
      // Loop through invites/groupId, get group name/description for each
      if (invites.length > 0) {
        for (var j = 0; j < invites.length; j ++) {

          dbHelpers.groupInformation(invites[j].group_id, j, function (error, info, groupId, j) {
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

    dbHelpers.groupMembers(parseInt(request.headers.groupid), null, function(error, members, groupId) {
      if (error) { return response.status(500).json({error: error}); }
      if (!members) { return response.status(409).json({error: 'There are no group members!' });}
      if (members.length > 0) {
        membersGroup.push(members);
        for (var i = 0; i < membersGroup[0].length; i++) {

          dbHelpers.getWaypoints(membersGroup[0][i].user_id, i, function(error, i, waypoints) {
            if (error) { return response.status(500).json({error: error}); }
            if (!waypoints) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }

            var member = [];
            membersGroup[0][i].waypoints = waypoints;

            if (i === membersGroup[0].length - 1) {
              response.status(200).json({waypoints: membersGroup});
            }
          });
        }
      } else {
        response.status(200).json({waypoints: membersGroup});
      }
    });
  });

};

