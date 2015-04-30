module.exports = function(app) {
  app.get('/', function(req, res){
    res.send('Received waypoint get request! Sending applicable waypoints.');
  });
  app.post('/', function(req, res){
    res.send('Received waypoint post request! Applying applicable waypoints.');
  });
};
