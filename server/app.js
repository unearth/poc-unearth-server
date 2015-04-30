var express = require('express');
var app = express();
var waypointRouter = express.Router();
var authenticationRouter = express.Router();


require('./routers/waypointRouter')(waypointRouter);
require('./routers/authenticationRouter')(authenticationRouter);


// Requests to /waypoint/* will be sent to this router

app.use('/waypoint', waypointRouter);
app.use('/user', authenticationRouter);

// Catches 404 and forwards to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
