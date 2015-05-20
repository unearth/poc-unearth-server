var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var BearerStrategy = require('passport-http-bearer').Strategy;

var authUtils = require('./authUtils');
var dbHelpers = require('../database/dbHelpers');


////////////////////////
// SIGN UP STRATEGY

passport.use( 'signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true   // Allows us to pass our request through passport
  },
  function(request, email, password, done) {

    // Creates an unearth response object
    if (!request.unearth) {request.unearth = {};}

    // Finds the user, using their email
    dbHelpers.getUser(email, 'email', function(error, user) {

      // Sends an error if the database request fails
      if (error) {
        request.unearth.error = 'The request has failed!';
        return done(null, true);
      }

      // Sends an error if the user already exists
      if(!!user){
        request.unearth.error = 'This user already exists!';
        return done(null, true);
      }

      // Sends an error if the user already exists
      if(!request.body.name){
        request.unearth.error = 'There is no username!';
        return done(null, true);
      }

      dbHelpers.addUser(email, request.body.name, authUtils.hash(password), function(error, user) {
        // Sends an error if the database request fails
        if (error) {
          request.unearth.error = 'The request has failed!';
          return done(null, true);
        }
        if(user){console.log('user: ', user.email);}
        // Creates token, saves it to the database, and sends it to the user
        var token = user.email + Date.now();
        var encryptedToken = authUtils.encodeToken(token);

        dbHelpers.addToken(token, user.user_id, function(error, success) {
          if (error) {
            request.unearth.error = 'Database call failed!';
            return done(null, true);
          }
          request.unearth.token = encryptedToken;
          return done(null, true);
        });
      });
    });
  }
));


////////////////////////
// LOCAL STRATEGY

passport.use( 'login-local', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback : true
  },
  function(request, email, password, done) {

    // Creates an unearth response object
    if(!request.unearth){ request.unearth = {}; }

    dbHelpers.getUser(email, 'email', function(error, user) {
      if (user) {console.log('user: ', user.email);}
      if (error) {return done(error, false);}

      // No user found with that email
      if (!user) {return done(null, false);}

      // Makes sure the password is correct
      if( !authUtils.validPassword(password, user.password) ) {
        return done(null, false);
      }

      // Creates token, saves it to the database, and sends it to the user
      var token = user.email + Date.now();
      var encryptedToken = authUtils.encodeToken(token);
      dbHelpers.addToken(token, user.user_id, function(error, result) {
        if(error){throw error;}
        request.unearth.token = encryptedToken;
        return done(null, true);
      });
    });

  }
));


////////////////////////
// BEARER STRATEGY

passport.use( 'login-token', new BearerStrategy({
    passReqToCallback : true
  },
  function(request, token, done) {

    // Decrypt the token to check against the database
    token = authUtils.decodeToken(token);

    // Creates an unearth response object
    if(!request.unearth){ request.unearth = {}; }

    dbHelpers.getUser(token, 'token', function(error, user) {
      if(user){console.log('user: ', user.email);}

      // The request has failed
      if (error) {return done(error, false);}

      // No user found with that email
      if (!user) {return done(null, false);}

      // Sends back a token
      request.unearth.token = token;
      return done(null, true);
    });
  }
));


module.exports = {
  signupAuth: passport.authenticate('signup', { session : false }),
  tokenAuth: passport.authenticate('login-token', { session : false }),
  localAuth: passport.authenticate('login-local', { session : false })
};

