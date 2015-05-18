var chai = require('chai');
var request = require('supertest');
var app = require('../server/app.js');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

describe('Group Router', function() {

  var testPoints = test.waypoints(3);

  xit('should make a group', function(done) {

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

    // Logs in
    request(app)
      .post('/login')
      .send(test.users[3])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        request(app)
          .post('/login')
          .send(test.users[4])
          .set('Accept', 'application/json')
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');

            // Sends an invite
            request(app)
              .post('/group/invite')
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

  xit('should accept an invitation to a group', function(done) {

    // Logs in
    request(app)
      .post('/login')
      .send(test.users[4])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        // Accepts an invitation
        request(app)
          .post('/group/accept')
          .send(test.groups[0])
          .set('Authorization', 'Bearer ' + response.body.token)
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            done();
          });
      });
  });


  xit('should get groups', function(done) {

    // Signs up
    request(app)
      .post('/login')
      .send(test.users[3])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        request(app)
          .post('/login')
          .send(test.users[4])
          .set('Accept', 'application/json')
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            expect(response.body.token).to.be.a('string');

            // Makes a group
            request(app)
              .post('/group')
              .set('Authorization', 'Bearer ' + response.body.token)
              .end( function(error, response) {
                if (error) { throw error; }
                expect(response.statusCode).to.equal(200);
                done();
              });
          });
      });
  });
});
