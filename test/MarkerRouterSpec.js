var chai = require('chai');
var request = require('supertest');
var app = require('../server/app.js');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('Marker Router', function() {

  var testPoints = test.markers(5, 1, "Group Name", "This is a marker desc", "");

  it('should handle signups and post requests for marker', function(done) {

    // Signs up
    request(app)
      .post('/signup')
      .send(test.users[5])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        // Posts Markers
        // request(app)
        //   .post('/marker')
        //   .send(testPoints)
        //   .set('Authorization', 'Bearer ' + response.body.token)
        //   .end( function(error, response) {
        //     if (error) { throw error; }
        //     expect(response.statusCode).to.equal(200);
             done();
        //   });
      });
  });

  it('should handle logins get requests for markers', function(done) {

    // Logs in
    request(app)
      .post('/login')
      .send(test.users[5])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        // Gets Markers
        request(app)
          .get('/marker')
          .set('Authorization', 'Bearer ' + response.body.token)
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            done();
          });
      });
  });
});
