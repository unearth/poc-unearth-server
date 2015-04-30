var express = require('express');
var app = express();

// Dependencies
var morgan = require('morgan');
var passport = require('passport');
var flash = require('connect-flash');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


app.use(morgan('dev'));  // Log to the console
app.use(cookieParser()); // Read cookies for auth

// Parse post bodies
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Passport Middleware
app.use(session({
  secret: 'supersecretsecret',
  resave: true,            // https://github.com/expressjs/session#resave
  saveUninitialized: true // https://github.com/expressjs/session#saveuninitialized
}));
app.use(passport.initialize());
app.use(passport.session()); // Persistent login sessions
app.use(flash()); // For flash messages stored in session

// Routers
var waypointRouter = express.Router();
var authenticationRouter = express.Router();

require('./routers/authenticationRouter')(authenticationRouter, passport);

app.use('/user', authenticationRouter);

// Catches 404 and forwards to error handler
app.use(function(request, response) {
  var error = new Error('Not Found');
  response.status(404).send(error);
});

module.exports = app;
