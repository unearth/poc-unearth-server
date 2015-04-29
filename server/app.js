var express = require('express'),
    app = express(),
    waypointRouter = express.Router(),
    authenticationRouter = express.Router();


require('./routers/waypointRouter')(waypointRouter);
require('./routers/authenticationRouter')(authenticationRouter);


// requests to /waypoint/* will be sent to this router

app.use('/waypoint', waypointRouter);
app.use('/user', authenticationRouter);

module.exports = app;
