var express = require('express'),
    app = express(),
    waypointRouter = express.Router(),
    authenticationRouter = express.Router();


require('./routers/waypointRouter')(waypointRouter);
require('./routers/authenticationRouter')(authenticationRouter);


// requests to /waypoint/* will be sent to this router

app.use('/waypoint', waypointRouter);
app.use('/user', authenticationRouter);

// catch 404 and forward to error handler

app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

module.exports = app;
