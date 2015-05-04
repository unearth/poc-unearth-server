var chai = require('chai');
var dbHelpers = require('../server/database/dbHelpers');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

dbHelpers.clearTables();

describe('Database - Adding Local Accounts', function() {
  var userId = null;

  it('should add a user to the database and return its user ID', function(done) {
    dbHelpers.addUser(test.users[0].email, test.users[0].password, function(error, user){
      expect(user.user_id).to.be.a('number');
      expect(user.email).to.equal(test.users[0].email);
      expect(user.password).to.equal(test.users[0].password);
      done();
    });
  });

  it('should get user from the database', function(done) {
    dbHelpers.getUser(test.users[0].email, function(error, user){
      expect(user.user_id).to.be.a('number');
      expect(user.email).to.equal(test.users[0].email);
      expect(user.password).to.equal(test.users[0].password);
      userId = user.user_id;
      done();
    });
  });
});

describe('Database - Waypoints', function() {
  it('should insert and retreive waypoints to and from the database', function(done) {
    var user = test.users[1];
    var waypoint = test.waypoints[1];
    dbHelpers.addUser(user.email, user.password, function(error){
      if(error){ throw error; }
      dbHelpers.addWaypoint(waypoint.userId, waypoint.longitude, waypoint.latitude, function(error){
        if(error){ throw error; }
        dbHelpers.getUser(user.email, function(error, user){
          if(error){ throw error; }
          expect(user.user_id).to.exist();
          expect(user.email).to.equal(user.email);
          dbHelpers.getWaypoints(user.user_id, function(error, waypoints){
            if(error){ throw error; }
            expect(waypoints[0].longitude).to.equal(waypoint.longitude);
            expect(waypoints[0].latitude).to.equal(waypoint.latitude);
            done();
          });
        });
      });
    });
  });
});
