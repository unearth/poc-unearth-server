var chai = require('chai');
var dbHelpers = require('../server/database/dbHelpers');
var userHelpers = require('../server/database/dbUserHelpers');
var waypointHelpers = require('../server/database/dbWaypointsHelpers');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

dbHelpers.clearTables();

describe('Database ', function() {
  var userId = null;

  it('should add a user to the database and return its user ID', function(done) {

    userHelpers.addUser(test.users[0].email, test.users[0].name, test.users[0].password, function(error, user) {
      expect(user.user_id).to.be.a('number');
      expect(user.email).to.equal(test.users[0].email);
      expect(user.name).to.equal(test.users[0].name);
      expect(user.password).to.equal(test.users[0].password);
      done();
    });
  });

  it('should get user from the database', function(done) {

    userHelpers.getUser(test.users[0].email, 'email', function(error, user) {
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
    var testPoints = test.waypoints(1);

    userHelpers.addUser(user.email, user.name, user.password, function(error, user) {
      if (error) { throw error; }

      waypointHelpers.addWaypoints(user.user_id, testPoints.waypoints, function(error) {
        if (error) { throw error; }

        userHelpers.getUser(user.email, 'email', function(error, user) {
          if (error) { throw error; }
          expect(user.user_id).to.exist();
          expect(user.email).to.equal(user.email);

          waypointHelpers.getWaypoints(user.user_id, function(error, waypoints) {
            if (error) { throw error; }
            expect(testPoints.waypoints[0][0]).to.equal(waypoints[0][0]);
            expect(testPoints.waypoints[0][1]).to.equal(waypoints[0][1]);
            done();
          });
        });
      });
    });
  });
});
