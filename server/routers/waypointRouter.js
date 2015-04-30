module.exports = function(app) {
  app.get('/', function(request, response) {
    response.send('Received waypoint get request! Sending applicable waypoints.');
  });
  app.post('/', function(request, response) {
    response.send('Received waypoint post request! Applying applicable waypoints.');
  });
};
