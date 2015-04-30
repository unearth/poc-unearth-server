module.exports = function(app, passport) {
  app.post('/login', function(request, response) {
    // Do Passport Stuff
  });

  app.post('/signup', function(request, response) {
    // Do Passport Stuff
  });

  app.post('/profile', isLoggedIn, function(request, response) {
    // Send profile data
    request.send(profile);
  });

  app.get('/waypoints', isLoggedIn, function(request, response) {
    // Get waypoints
    response.send('waypoints');
  });
  app.post('/waypoints', isLoggedIn, function(request, response) {
    // Add a waypoint
  });

  app.get('/logout', function(request, response) {
    request.logout();
  });
};

// Routes middleware to make sure a user is logged in
function isLoggedIn(request, response, next) {
  // If user is authenticated in the session, carry on
  if (request.isAuthenticated()){
      return next();
  }
}
