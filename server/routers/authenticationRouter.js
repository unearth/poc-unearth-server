module.exports = function(app) {
  app.post('/login', function(request, response) {
    response.send('Received login post request! Initiating login procedure/send back token.');
  });

  app.post('/signup', function(request, response) {
    response.send('Received signup post request! Initiating signup procedure/send back token.');
  });
};
