var chai = require('chai');
var request = require('request');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;
var request = require('supertest');
var app = require('../server/app.js').app;

describe('Server Routes', function() {

  it('should return status code 200 for a get request to waypoint', function() {
    request("http://localhost:3000")
      .get('/waypoint')
      .end(function(err, res){
        if(err){
          throw err;
        }
        res.should.have.status(200);
        done();
      })
  });

  it('should return status code 200 for a post request to waypoint', function() {
    request("http://localhost:3000")
      .post('/waypoint')
      .end(function(err, res){
        if(err){
          throw err;
        }
        res.should.have.status(200);
        done();
      })
  });

  it('should return status code 404 for an invalid get request', function() {
    request("http://localhost:3000")
      .get('/secrets')
      .end(function(err,res){
        if(err){
          throw err;
        }
        res.should.have.status(404);
        done;
      })
  });

});
