var dbHelpers = require('../database/dbHelpers.js');
var cloudAPI = require('../config.js');
var cloudinary = require('cloudinary');
var multiparty = require('multiparty');
var fs = require('fs');


cloudinary.config({
  cloud_name: cloudAPI.cloudinary.cloudName,
  api_key: cloudAPI.cloudinary.apiKey,
  api_secret: cloudAPI.cloudinary.apiSecret
});

module.exports = function(app, authController) {

  // Creates and sends back a token for subsequent user requests
  app.post('/login', authController.localAuth, function(request, response) {
    if (request.unearth.error) { return response.status(403).json({error: request.unearth.error}); }
    response.status(200).json({token: request.unearth.token});
  });

  // Inserts a new user's email/password into the database
  // Creates and returns a token
  app.post('/signup', authController.signupAuth, function(request, response) {

    // TODO: Sanitize.  Expect email string and a password string
    if (request.unearth.error) {return response.status(403).json({error: request.unearth.error}); }

    response.status(200).json({token: request.unearth.token});
  });

  // Removes a user's token from the database
  app.post('/logout', function(request, response) {
    var token = request.headers.authorization.split(' ')[1];

    dbHelpers.deleteToken(token, function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      response.status(200).json({success: 'Session has been removed!'});
    });
  });

  app.post('/imageUpload', function(req, res) {

    var form = new multiparty.Form();

    var resizeImageURL = function(url, width) {
      var urlPieces = url.split('upload/');
      return urlPieces[0] + 'upload/w_'+width+'/' + urlPieces[1];
    }

    var stream =  cloudinary.uploader.upload_stream(function(result) {
      // Get the image_url for a 170px wide image
      req.body.image_url = resizeImageURL(result.url, 170);
      // Post the review with req containing the necessary properties
      res.status(202).end(JSON.stringify(req.body));
    });
      // The form parses the req, and finds the fields and files
    form.parse(req, function(err, fields, files){
      // Add the fields from the FormData to the req body
      for (var key in fields) {
        req.body[key] = fields[key][0];
      }
      // Send the file path to the cloudinary stream reader by piping from a fs.createReadStream
      fs.createReadStream(files.file[0].path)
        .pipe(stream);
    })
  })

}
