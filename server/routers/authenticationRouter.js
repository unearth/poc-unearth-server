module.exports = function(app){
  app.get('/login', function(req, res){
    res.send('Received login get request! Sending login page.');
  });

  app.post('/login', function(req, res){
    res.send('Received login post request! Initiating login procedure/send back token.');
  });

  app.get('/signup', function(req, res){
    res.send('Received signup get request! Sending signup page.');
  });

  app.post('/signup', function(req, res){
    res.send('Received signup post request! Initiating signup procedure/send back token.');
  });
};
