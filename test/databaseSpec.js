var chai = require('chai');
var dbHelpers = require('../server/database/dbHelpers');
var test = require('./testData');

var assert = chai.assert;
var should = chai.should();
var expect = chai.expect;

dbHelpers.clearTables();

describe('Database - Users', function() {

  it('should insert users to the database', function(done) {
    var user = test.users[0];
    dbHelpers.insertUser(user.username, user.password, function(error){
      if(error){ throw error; }
      dbHelpers.getUser(user.username, function(error, rows){
        if(error){ throw error; }
        expect(rows.length).to.equal(1);
        expect(rows[0].username).to.equal(user.username);
        expect(rows[0].password).to.equal(user.password);
        done();
      });
    });
  });

  it('should delete users from the database', function(done) {
    var waypoint = test.waypoints[0];
    var user = test.users[0];
    dbHelpers.insertWaypoint(waypoint.userId, waypoint.longitude, waypoint.latitude, function(error){
      if(error){ throw error; }
      dbHelpers.getUser(user.username, function(error, rows){
        if(error){ throw error; }
        dbHelpers.deleteUser(rows[0].user_id, function(error, rows){
          if(error){ throw error; }
          expect(Array.isArray(rows)).to.equal(true);
          done();
        });
      });
    });
  });
});

describe('Database - Waypoints', function() {

  it('should insert and retreive waypoints to and from the database', function(done) {
    var user = test.users[1];
    var waypoint = test.waypoints[1];
    dbHelpers.insertUser(user.username, user.password, function(error){
      if(error){ throw error; }
      dbHelpers.insertWaypoint(waypoint.userId, waypoint.longitude, waypoint.latitude, function(error){
        if(error){ throw error; }
        dbHelpers.getUser(user.username, function(error, rows){
          if(error){ throw error; }
          expect(rows.length).to.equal(1);
          expect(rows[0].user_id).to.exist();
          expect(rows[0].username).to.equal(user.username);
          expect(rows[0].password).to.equal(user.password);
          dbHelpers.getWaypoints(rows[0].user_id, function(error, rows){
            if(error){ throw error; }
            expect(rows[0].longitude).to.equal(waypoint.longitude);
            expect(rows[0].latitude).to.equal(waypoint.latitude);
            done();
          });
        });
      });
    });
  });
});
