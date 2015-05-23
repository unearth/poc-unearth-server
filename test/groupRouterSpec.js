var chai = require('chai');
var request = require('supertest');
var app = require('../server/app.js');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

var dbHelpers = require('../server/database/dbHelpers');
dbHelpers.clearTables();

describe('Group Router', function() {

  var testPoints = test.waypoints(3);

  it('should make a group', function(done) {

    // Signs up
    request(app)
      .post('/signup')
      .send(test.users[1])
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

  it('should invite users to a group', function(done) {

    // Logs in
    request(app)
      .post('/login')
      .send(test.users[4])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');
        var token = response.body.token;
        // Sends an invite
        request(app)
          .get('/group')
          .set('Authorization', 'Bearer ' + token)
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            // Sends an invite
            request(app)
              .post('/group/invite')
              .send({
                email: "Melony@gmail.com",
                groupId: 1
              })
              .set('Authorization', 'Bearer ' + token)
              .end( function(error, response) {
                if (error) { throw error; }
                expect(response.statusCode).to.equal(200);
                done();
              });
          });
      });
  });

  it('should accept an invitation to a group', function(done) {

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
          .send({'groupId': 1})
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            done();
          });
      });
  });


  it('should get groups', function(done) {

    // Signs up
    request(app)
      .post('/login')
      .send(test.users[1])
      .set('Accept', 'application/json')
      .end( function(error, response) {
        if (error) { throw error; }
        expect(response.statusCode).to.equal(200);
        expect(response.body.token).to.be.a('string');

        // Makes a group
        request(app)
          .get('/group')
          .set('Authorization', 'Bearer ' + response.body.token)
          .end( function(error, response) {
            if (error) { throw error; }
            expect(response.statusCode).to.equal(200);
            done();
          });
      });
  });
});
