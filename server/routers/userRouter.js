var userHelpers = require('../database/dbUserHelpers.js');

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
    if (request.unearth.error) {console.log(request.unearth.error); return response.status(403).json({error: request.unearth.error}); }

    response.status(200).json({token: request.unearth.token});
  });

  // Removes a user's token from the database
  app.post('/logout', function(request, response) {
    var token = request.headers.authorization.split(' ')[1];

    userHelpers.deleteToken(token, function(error, user) {
      if (error) { return response.status(500).json({error: error}); }
      response.status(200).json({success: 'Session has been removed!'});
    });
  });
};
