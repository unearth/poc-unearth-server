var dbHelpers = require('../database/dbHelpers.js');

module.exports = function(app, authController) {

  // Invites a user to a group (using a groupID and the invited person's email)
  app.post('/invite', authController.tokenAuth, function(request, response) {
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      // TODO: condense getUser requests to promises?
      if (error) {
        response.status(500).json({error: error});
        return;
      }
      if (!user) {
        response.status(409).json({error: 'This isn\'t an existing user!' });
        return;
      }

      var sender_id = user.user_id;

      dbHelpers.getUser(request.body.email, 'email', function(error, user) {
        if (error) {
          response.status(500).json({error: error});
          return;
        }
        if (!user) {
          response.status(409).json({error: 'This isn\'t an existing user!' });
          return;
        }

        var receiver_id = user.user_id;

        dbHelpers.inviteUser(request.body.groupID, sender_id, receiver_id, function(error) {
          if (error) {
            response.status(500).json({error: error});
          return;
          }
          response.status(200).json({success: 'Group request has been sent!'});
        });
      });
    });
  });

  // Accepts an invite, adds user to group, and removes user from pending invites
  app.post('/accept', authController.tokenAuth, function(request, response) {
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      // TODO: condense getUser requests to promises?
      if (error) {
        response.status(500).json({error: error});
        return;
      }
      if (!user) {
        response.status(409).json({error: 'This isn\'t an existing user!' });
        return;
      }
      var user_id = user.user_id;

      dbHelpers.deleteInvite(user_id, request.body.groupID, function(error) {
        if (error) {
            response.status(500).json({error: error});
          return;
        }
        response.status(200).json({success: 'Group request is no longer pending!'});
      });

      dbHelpers.addToGroup(user_id, request.body.groupID, function(error) {
        if (error) {
            response.status(500).json({error: error});
          return;
        }
        response.status(200).json({success: 'Group request has been accepted!'});
      });
    });
  });

  // Denies a group invite, removes invited user from pending invites table
  app.post('/deny', authController.tokenAuth, function(request, response) {
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      // TODO: condense getUser requests to promises?
      if (error) {
        response.status(500).json({error: error});
        return;
      }
      if (!user) {
        response.status(409).json({error: 'This isn\'t an existing user!' });
        return;
      }
      var user_id = user.user_id;

      dbHelpers.deleteInvite(user_id, request.body.groupID, function(error) {
        if (error) {
            response.status(500).json({error: error});
          return;
        }
        response.status(200).json({success: 'Group request has been declined!'});
      });
    });
  });

  // Creates a group with token (sender_id - added to group), groupName, groupDescription, and email (receiver_id)
  app.post('/create', authController.tokenAuth, function(request, response) {
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      // TODO: condense getUser requests to promises?
      if (error) {
        response.status(500).json({error: error});
        return;
      }
      if (!user) {
        response.status(409).json({error: 'This isn\'t an existing user!' });
        return;
      }
      var sender_id = user.user_id;

      dbHelpers.createGroup(request.body.groupName, request.body.groupDescription,  function(error, group) {
        if (error) {
            response.status(500).json({error: error});
          return;
        }
        var group_id = group.group_id;

        for (var i = 0; i < request.body.emails.length; i++) {
          dbHelpers.getUser(request.body.emails[i], 'email', function(error, user) {
            // TODO: condense getUser requests to promises?
            if (error) {
              response.status(500).json({error: error});
              return;
            }
            // do I want to throw this error?
            if (!user) {
              response.status(409).json({error: 'This isn\'t an existing user!' });
              return;
            }
            dbHelpers.inviteUserToGroup(group_id, sender_id, user.user_id,function(error) {
              if (error) {
                response.status(500).json({error: error});
                return;
               }
              response.status(200).json({success: 'Group request has been sent!'});
            });
          });
        }

        dbHelpers.addToGroup(sender_id, group_id, function(error) {
          if (error) {
            response.status(500).json({error: error});
            return;
          }
          response.status(200).json({success: 'Group has been created!'});
        });
      });
    });
  });

  // query database for user's groups
  app.get('/groups', authController.tokenAuth, function(request, response) {
    dbHelpers.groupListing(request.unearth.token, function(error, groups) {
      if (error) {
        response.status(500).json({error: error});
        return;
      }
      if (!groups) {
        response.status(409).json({error: 'There are no groups!' });
        return;
      }
      // cycle through groups, get users for each group, create objects for each group
      for (var i = 0; i < groups.length; i++) {
        dbHelpers.groupMembers(groups[i].group_id, function(error, members) {
          if (error) {
            response.status(500).json({error: error});
            return;
          }
          groups[i].members = members;
        });
        dbHelpers.pendingGroupMembers(groups[i].group_id, function(error, pendingMembers) {
          if (error) {
            response.status(500).json({error: error});
            return;
          }
          groups[i].pendingMembers = pendingMembers;
        });
        for (var j = 0; j < groups[i].members.length; j++) {
          user_id = groups[i].members[j].user_id;
          dbHelpers.getWaypoints(user_id, function(error, waypoints) {
            if (error) {
              response.status(500).json({error: error});
              return;
            }
            groups[i].members[j].waypoints = waypoints;
          });
        }
      }
      response.status(200).json({groups: groups});
    });
  });

'/groups/waypoints' GROUP ID

};

