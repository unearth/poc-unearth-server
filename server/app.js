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
app.use(function(request, response, next) {
  var error = new Error('Not Found');
  response.status(404).send(error);
});

module.exports = app;
