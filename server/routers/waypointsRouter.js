var userHelpers = require('../database/dbUserHelpers.js');
var waypointsHelpers = require('../database/dbWaypointsHelpers.js');

module.exports = function(app, authController) {

  // Authenticates with a user's token
  // Sends pack an object of waypoints
  app.get('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanitize. Expect starting waypoint id default to 0
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) {
        return response.status(409).json({error: 'This isn\'t an existing user!' });
      }

// ADDED NULL HERE TO ACCT FOR GROUP GET WAYPOINTS

      waypointsHelpers.getWaypoints(user.user_id, function(error, user, waypoints) {
        if (error) { return response.status(500).json({error: error}); }
        response.status(200).json({waypoints: waypoints});
      });
    });
  });

  // Authenticates with a user's token
  // Posts an array of new waypoints to the database
  app.post('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanititze, Expect {waypoints:[]}
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error});}
      if(!request.body.waypoints || request.body.waypoints.length < 1 ) {
        return response.status(409).json({error: 'There are no waypoints!'});
      }
      waypointsHelpers.addWaypoints(user.user_id, request.body.waypoints, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        if (!user) {
          return response.status(409).json({error: 'This isn\'t an existing user!'});
        }
        response.status(200).json({success: 'Waypoints have been posted!'});
      });
    });
  });
};
