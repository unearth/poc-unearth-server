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

        dbHelpers.addToGroup(senderId, groupId, function(error) {
          if (error) { return response.status(500).json({error: error}); }
          response.status(200).json({success: 'Group has been created!'});
        });
      });
    });
  });

  // Queries database for user's groups
  app.get('/', authController.tokenAuth, function(request, response) {
    var groupsWithMembers = [];
    dbHelpers.groupListing(request.unearth.token, function(error, groups) {
      if (error) { return response.status(500).json({error: error}); }
      if (!groups) { return response.status(409).json({error: 'There are no groups!' });}

      var outstandingInvites = [];
      var j;

      // get outstanding invite groupId and senderId!!!!!!

      dbHelpers.outstandingInvites(request.unearth.token, function(error, invites) {
        if (error) { return response.status(500).json({error: error}); }
        if (!invites) { return response.status(409).json({error: 'There are no outstanding invites!' });}



        for (var j = 0; j < invites.length; j ++) {
          console.log('groupid', invites[j].group_id)

          dbHelpers.groupInformation(invites[j].group_id, j, function (error, info, groupId, j) {
            if (error) { return response.status(500).json({error: error}); }
            if (!groups) { return response.status(409).json({error: 'There are no groups!' });}

              outstandingInvites.push([invites[j], info]);
          });
        };

        // Cycles through groups, gets users for each group
        for (var i = 0; i < groups.length; i++ ) {

          // TODO: groupMembers db helper has changed: the function below does NOT reflect that change
          // The Fn below needs to first select all member user_ids, and then get user_info for those IDs

          dbHelpers.groupMembers(groups[i].group_id, i, function(error, members, groupId, i) {
            if (error) { return response.status(500).json({error: error}); }
            if (!groupMembers) { return response.status(409).json({error: 'There are no group members!' });}
            console.log(members, i);
            groups[i].members = members;
          });

          dbHelpers.pendingGroupMembers(groups[i].group_id, i, function(error, pendingMembers, groupId, i) {
            if (error) { return response.status(500).json({error: error}); }
            groups[i].pendingMembers = pendingMembers;
            if ((i === groups.length -1) && (j === invites.length)) {
              groups.push({'outstandingInvites': outstandingInvites});
              console.log(groups);
              response.status(200).json({groups: groups});
            }
          });
        };
      });
    });
  });

  app.get('/waypoints', authController.tokenAuth, function(request, response) {
    var membersGroup = [];
    var i;
    dbHelpers.groupMembers(parseInt(request.headers.groupid), null, function(error, members, groupId) {
      if (error) { return response.status(500).json({error: error}); }
      if (!members) { return response.status(409).json({error: 'There are no group members!' });}

      for (var i = 0; i < members.length; i++) {
        dbHelpers.getUser(members[i].user_id, 'user_id', function(error, user) {
          if (error) { return response.status(500).json({error: error}); }
          if (!user) { return response.status(409).json({error: 'This isn\'t an existing sender!' }); }
          var member = [];
          member.push(user.user_id, user.name, user.email);
          membersGroup.push(member);
          console.log(membersGroup);
        });
      };

      if (i === members.length) {
        console.log('members in json', membersGroup);
        response.status(200).json({members: membersGroup});
      }
    });
  });

};

