module.exports = function(app, authController) {

  // Creates and sends back a token for subsequent user requests
  app.post('/login', authController.localAuth, function(request, response) {
    if (request.unearth.error) {
      response.sendStatus(403);
      response.json({error: request.unearth.error});
    }
    response.json({token: request.unearth.token});
  });

  // Inserts a new user's email/password into the database
  // Creates and returns a token
  app.post('/signup', authController.signupAuth, function(request, response) {
    if (request.unearth.error) {
      response.sendStatus(403);
      response.json({error: request.unearth.error});
    }
    response.json({token: request.unearth.token});
  });

  // Removes a user's token from the database
  app.get('/logout', function(request, response) {

    var token = request.headers.authorization.split(' ')[1];

    dbHelpers.deleteToken(token, function(error, user){
      if (error) {  response.json({error: error });  }
      response.json({success: 'Session has been removed!'});
    });
  });
};
