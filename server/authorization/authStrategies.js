var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

var util = require('./authUtils');
var dbHelpers = require('../database/dbHelpers');

passport.use('basic-login', new BasicStrategy(
  function(email, password, done) {
    dbHelpers.getUser(email, function(error, user) {

      if (error) { return done(error); }

      // No user found with that email
      if (!user) { return done(null, false); }

      // Make sure the password is correct
      if( !util.validPassword(password, user.password) ) {
        return done(null, false);
      }

      // Success
      return done(null, user);
    });
  }
));

exports.isAuthenticated = passport.authenticate('basic-login', { session : false });
