var userHelpers = require('../database/dbUserHelpers.js');
var markerHelpers = require('../database/dbMarkerHelpers.js');
var cloudAPI = require('../config.js');
var cloudinary = require('cloudinary');
var multiparty = require('multiparty');
var fs = require('fs');

cloudinary.config({
  api_key: cloudAPI.cloudinary.apiKey,
  cloud_name: cloudAPI.cloudinary.cloudName,
  api_secret: cloudAPI.cloudinary.apiSecret
});

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

  // Uploads an image to cloudinary
  app.post('/image', function(request, response) {

    var form = new multiparty.Form();
    var resizeImageURL = function(url, width) {
      var urlPieces = url.split('upload/');
      return urlPieces[0] + 'upload/w_'+width+'/' + urlPieces[1];
    };

    var stream =  cloudinary.uploader.upload_stream(function(result) {
      // Get the image_url for a 170px wide image
      request.body.image_url = resizeImageURL(result.url, 170);
      // Post the review with req containing the necessary properties
      response.status(202).end(JSON.stringify(request.body));
    });
      // The form parses the req, and finds the fields and files
    form.parse(request, function(err, fields, files){
      // Add the fields from the FormData to the req body
      for (var key in fields) {
        request.body[key] = fields[key][0];
      }
      // Send the file path to the cloudinary stream reader by piping from a fs.createReadStream
      fs.createReadStream(files.file[0].path)
        .pipe(stream);
    });
  });
};
