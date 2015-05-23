var express = require('express');
var app = express();

// Dependencies
var morgan = require('morgan');
var passport = require('passport');
var bodyParser = require('body-parser');

var authController = require('./authorization/authStrategies');

// Parses post bodies
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// Initializes passport
app.use(passport.initialize());

// Allows CORS
app.use(function(request, response, next) {
  response.header("Access-Control-Allow-Origin", "*");
  response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Logs request data
app.use(morgan('dev'));
app.use(function(request, response, next) {
  console.log('-------------------------------');
  console.log('data: ', request.body);
  next();
});


////////////////////////
// ROUTES

// Initializes routers
var userRouter = express.Router();
var groupRouter = express.Router();
var markerRouter = express.Router();
var waypointsRouter = express.Router();

// Declares the router paths
app.use('/', userRouter);
app.use('/group', groupRouter);
app.use('/marker', markerRouter);
app.use('/waypoints', waypointsRouter);

// Runs the router functions in order to add them to the path
require('./routers/userRouter')(userRouter, authController);
require('./routers/groupRouter')(groupRouter, authController);
require('./routers/markerRouter')(markerRouter, authController);
require('./routers/waypointsRouter')(waypointsRouter, authController);

// Catches unknown routes and throws back a 404 response
app.use( function(request, response) {
  var error = new Error('Not Found');
  response.status(404).json({error: error});
});

module.exports = app;
