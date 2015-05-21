var dbHelpers = require('../database/dbHelpers.js');

module.exports = function(app, authController) {

  // Authenticates with a user's token
  // Sends pack an object of waypoints
  app.get('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanitize. Expect starting waypoint id default to 0
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) {
        return response.status(409).json({error: 'This isn\'t an existing user!' });
      }

// ADDED NULL HERE TO ACCT FOR GROUP GET WAYPOINTS

      dbHelpers.getWaypoints(user.user_id, user, function(error, user, waypoints) {
        if (error) { return response.status(500).json({error: error}); }
        response.status(200).json({waypoints: waypoints});
      });
    });
  });

  // Authenticates with a user's token
  // Posts an array of new waypoints to the database
  app.post('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanititze, Expect {waypoints:[]}
    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error});}
      if(!request.body.waypoints || request.body.waypoints.length < 1 ) {
        return response.status(409).json({error: 'There are no waypoints!'});
      }
      dbHelpers.addWaypoints(user.user_id, request.body.waypoints, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        if (!user) {
          return response.status(409).json({error: 'This isn\'t an existing user!'});
        }
        response.status(200).json({success: 'Waypoints have been posted!'});
      });
    });
  });
};
