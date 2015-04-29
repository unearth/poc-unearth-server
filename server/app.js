var express = require('express'),
    app = express(),
    waypointRouter = express.Router();

require('./routers/waypointRouter')(waypointRouter);

// requests to /waypoint/* will be sent to this router

app.use('/waypoint', waypointRouter);

module.exports = app;
