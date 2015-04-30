// Imports our Dependencies
var LocalStrategy = require('passport-local').Strategy;
var db = require('../database/dbHelpers');
var utils = require('./authUtils.js');

module.exports = function(passport) {

  // SESSION SETUP - http://passportjs.org/guide/configure/
    // Allows passport to serialize and unserialize users from a session

  // Serializes a user
  passport.serializeUser(function(userId, done) {
    done(null, userId);
  });

  // Deserializes a user
  passport.deserializeUser(function(id, done) {
    // Find a user by id
      //done(err, user);
  });

  // Local Signup
    // Uses named strategies, since we have one for login and one for signup
    // By default, if there was no name, it'd be called 'local'
    // Local strategy defaults to username and password, we are overriding with email
    // http://passportjs.org/guide/username-password/
  passport.use('local-signup', new LocalStrategy({
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // Allows us to pass back the entire request to the callback
    },
    function(req, email, password, done) {
      // Verify whether the email is already used as soon as data is sent back
      process.nextTick(function() {
        verifyEmail();
      });
    })
  );

  passport.use('local-login', new LocalStrategy({
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true
    },
    function(req, email, password, done) {

      db.getLocalUser(email, function(error, rows){
        if(error){
          return done(error);
        }
        if(rows.length === 0){
          // No user is found!
        }
        if(!validPassword(rows[0].password)){
          // Wrong password
        }
      });
    })
  );
};

