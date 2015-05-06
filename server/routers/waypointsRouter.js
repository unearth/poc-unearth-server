var dbHelpers = require('../database/dbHelpers.js');

module.exports = function(app, authController) {

  // Authenticates with a user's token
  // Sends pack an object of waypoints
  app.get('/', authController.tokenAuth, function(request, response) {

    dbHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { response.json({error: error }); }
      if (!user) { response.json({error: 'This isn\'t an existing user!' }); }

      dbHelpers.getWaypoints(user.user_id, function(error, waypoints) {
        if (error) { response.json({error: error}); }
        response.json({waypoints: waypoints});
      });
    });
  });

  // Authenticates with a user's token
  // Posts an array of new waypoints to the database
  app.post('/', authController.tokenAuth, function(request, response) {

    dbHelpers.getUser(request.unearth.token, 'token', function(error, user){

      dbHelpers.addWaypoint(user.user_id, request.body.latitude, request.body.longitude, function(error) {
        if (error) { response.json({error: error }); }
        if (!user) { response.json({error: 'This isn\'t an existing user!' }); }
        response.json({success: 'Waypoints have been posted!'});
      });
    });
  });
};
