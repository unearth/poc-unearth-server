var express = require('express');
var app = express();

// Dependencies
var morgan = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser');

var dbHelpers = require('./database/dbHelpers');
var authController = require('./authorization/authStrategies');

// Logs requests
app.use(morgan('dev'));

// Parses post bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Logs request properties
app.use(function(request, response, next) {
  console.log('data: ', request.body);
  next();
});

// Initializes passport
app.use(passport.initialize());

// Allows CORS
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

////////////////////////
// ROUTES

// Initializes routers
var waypointsRouter = express.Router();
var userRouter = express.Router();

// Declares the router paths
app.use('/waypoints', waypointsRouter);
app.use('/', userRouter);

// Runs the router functions in order to add them to the path
require('./routers/waypointsRouter')(waypointsRouter, authController);
require('./routers/userRouter')(userRouter, authController);

// Catches unknown routes and throws back a 404 response
app.use( function(request, response) {
  var error = new Error('Not Found');
  response.status(404).json({error: error});
});

module.exports = app;
