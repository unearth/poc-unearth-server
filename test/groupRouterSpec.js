var chai = require('chai');
var request = require('supertest');
var app = require('../server/app.js');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('Waypoint Routes', function() {

  var testPoints = test.waypoints(3);

  it('should make a group', function(done) {

    // Signs up
    request(app)
      .post('/signup')
      .send(test.users[3])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        request(app)
          .post('/signup')
          .send(test.users[4])
          .set('Accept', 'application/json')
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');

            // Makes a group
            request(app)
              .post('/group/create')
              .send(test.groups[0])
              .set('Authorization', 'Bearer ' + response.body.token)
              .end( function(error, response) {
                if (error) { throw error; }
                expect(response.statusCode).to.equal(200);
                done();
              });
          });
      });
  });

  xit('should invite users to a group', function(done) {
  });
});
