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

        dbHelpers.inviteUser(request.body.groupId, senderId, receiverId, function(error) {
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

      dbHelpers.deleteInvite(user_id, request.body.groupID, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        dbHelpers.addToGroup(user_id, request.body.groupID, function(error) {
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
        if (error) { response.status(500).json({error: error}); }
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

          dbHelpers.inviteUserToGroup(groupId, senderId, user.user_id,function(error) {
            if (error) { return response.status(500).json({error: error}); }
            response.status(200).json({success: 'Group request has been sent!'});
          });
        };

        for (var i = 0; i < request.body.emails.length; i++) {
          dbHelpers.getUser(request.body.emails[i], 'email', inviteUser);
        }

        dbHelpers.addToGroup(sender_id, group_id, function(error) {
          if (error) { return response.status(500).json({error: error}); }
          response.status(200).json({success: 'Group has been created!'});
        });
      });
    });
  });

  // Queries database for user's groups
  app.get('/groups', authController.tokenAuth, function(request, response) {
    dbHelpers.groupListing(request.unearth.token, function(error, groups) {
      if (error) { return response.status(500).json({error: error}); }
      if (!groups) { return response.status(409).json({error: 'There are no groups!' });}

      var groupMembers = function(error, members) {
        if (error) { return response.status(500).json({error: error}); }
        groups[i].members = members;
      };

      var memberWaypoints = function(error, waypoints) {
        if (error) { return response.status(500).json({error: error}); }
        groups[i].members[j].waypoints = waypoints;
      };

      // Cycles through groups, gets users for each group, and creates objects for each group
      for (var i = 0; i < groups.length; i++) {
        dbHelpers.groupMembers(groups[i].group_id, groupMembers);
        dbHelpers.pendingGroupMembers(groups[i].group_id, groupMembers);

        for (var j = 0; j < groups[i].members.length; j++) {
          dbHelpers.getWaypoints(groups[i].members[j].user_id, memberWayponts);
        }
      }
      response.status(200).json({groups: groups});
    });
  });
};

