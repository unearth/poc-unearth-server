var userHelpers = require('../database/dbUserHelpers.js');
var markerHelpers = require('../database/dbMarkerHelpers.js');

module.exports = function(app, authController) {

  // Authenticates with a user's token
  // Sends pack an object of markers
  app.get('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanitize. Expect starting waypoint id default to 0
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      if (!user) {
        return response.status(409).json({error: 'This isn\'t an existing user!' });
      }

      markerHelpers.getMarkers(user.user_id, function(error, markers) {
        if (error) { return response.status(500).json({error: error}); }
        response.status(200).json({markers: markers});
      });
    });
  });

  // Authenticates with a user's token
  // Posts an array of new markers to the database
  app.post('/', authController.tokenAuth, function(request, response) {

    // TODO: Sanititze, Expect {markers:[]}
    userHelpers.getUser(request.unearth.token, 'token', function(error, user) {
      if (error) { return response.status(500).json({error: error});}
      if(!request.body.markers || request.body.markers.length < 1 ) {
        return response.status(409).json({error: 'There are no markers!'});
      }
      var body = request.body;
      markerHelpers.addMarkers(user.user_id, body.markers, function(error) {
        if (error) { return response.status(500).json({error: error}); }
        if (!user) {
          return response.status(409).json({error: 'This isn\'t an existing user!'});
        }
        response.status(200).json({success: 'Markers have been posted!'});
      });
    });
  });
};
