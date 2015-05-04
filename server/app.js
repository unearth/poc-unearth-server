var express = require('express');
var app = express();

// Dependencies
var morgan = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

var dbHelpers = require('./database/dbHelpers');
var authUtils = require('./authorization/authUtils');
var authController = require('./authorization/authStrategies');

// Logs requests
app.use(morgan('dev'));
app.use(cookieParser());

// Parses post bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(passport.initialize());


////////////////////////
// ROUTES

app.post('/login', authController.isAuthenticated, function(request, response){
  response.send('Login isn\'t a feature yet.  Please send your password with each request');
});

app.post('/signup', function(request, response){
  if(request.body.email && request.body.password){
    dbHelpers.addUser(request.body.email, authUtils.hash(request.body.password), function(error, user){
      response.send(user);
    });
  } else{
    response.send('Incorrect Data');
  }
});

app.get('/waypoints', authController.isAuthenticated, function(request, response) {
  var email = request.headers.email;
  if(email){
    dbHelpers.getUser(email, function(error, user){
      if(error){ response.send(error); }
      if(!user){ response.send('This isn\'t an existing user!'); }

      dbHelpers.getWaypoints(user.user_id, function(error, waypoints){
        if(error){ response.send(error); }
        response.send(waypoints);
      });
    });
  }else {
    response.send('Invalid Data');
  }
});

app.post('/waypoints', authController.isAuthenticated, function(request, response) {
  var email = request.body.email;
  if(email){
    dbHelpers.getUser(email, function(error, user){
      dbHelpers.addWaypoint(user.user_id, request.body.longitude,request.body.latitude, function(error){
        console.log(user);
        if(error){
          response.send(error);
          throw error;
        }
        response.send("posted!");
      });
    });
  } else{
    response.send('Invalid Data');
  }
});

app.get('/logout', function(request, response) {
  response.send('Logout isn\'t a feature yet.  Please send your password with each request');
});


// Catches 404 and forwards to error handler
app.use(function(request, response) {
  var error = new Error('Not Found');
  response.status(404).send(error);
});

module.exports = app;
