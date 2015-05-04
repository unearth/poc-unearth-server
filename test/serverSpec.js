var chai = require('chai');
var request = require('supertest');
var app = require('../server/app.js');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('Server Routes', function() {

  it('should handle unauthorized get requests to the waypoint router', function(done) {
    request(app)
      .get('/waypoints')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it('should handle unauthorized post requests for waypoints', function(done) {
    request(app)
      .post('/waypoints')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(401);
        done();
      });
  });

  it('should return status code 404 for an invalid get request', function(done) {
    request(app)
      .get('/thisisnotaroute')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(404);
        done();
      });
  });

});
