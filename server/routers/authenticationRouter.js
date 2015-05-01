module.exports = function(app, passport) {
  app.post('/login',
    passport.authenticate('local-login', { successRedirect: '/'
      failureRedirect: '/login',
      failureFlash: 'true'})
  );

  app.post('/signup',
      passport.authenticate('local-login', { successRedirect: '/'
      failureRedirect: '/signup',
      failureFlash: 'true'})
  );

  // Redirect to facebook for authentication
  app.get('/auth/facebook', passport.authenticate('facebook'));

  // Facebook will redirect user to one of the following URLs
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/login' }));

  // Redirect to google for authentication
  app.get('/auth/google',
    passport.authenticate('google'));

  // Google will redirect user to one of the following URLs
  app.get('/auth/google/callback',
    passport.authenticate('google', { successRedirect: '/',
                                      failureRedirect: '/login' }));

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
