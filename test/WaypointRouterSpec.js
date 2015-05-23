var chai = require('chai');
var request = require('supertest');
var app = require('../server/app.js');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('Waypoint Router', function() {

  var testPoints = test.waypoints(2);

  it('should handle signups and post requests for waypoint', function(done) {

    // Signs up
    request(app)
      .post('/signup')
      .send(test.users[2])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        // Posts Waypoints
        request(app)
          .post('/waypoints')
          .send(testPoints)
          .set('Authorization', 'Bearer ' + response.body.token)
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            done();
          });
      });
  });

  it('should handle logins get requests for waypoints', function(done) {

    // Logs in
    request(app)
      .post('/login')
      .send(test.users[2])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        // Gets Waypoints
        request(app)
          .get('/waypoints')
          .set('Authorization', 'Bearer ' + response.body.token)
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            done();
          });
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
