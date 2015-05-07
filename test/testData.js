module.exports.users = [
  { email: 'Joe@gmail.com',
    password: 'mysecretpassword'},
  { email: 'Melony@gmail.com',
    password: 'ihaveasecurepassword'},
  { email: 'Brian@gmail.com',
    password: 'mysecrethashedpassword'},
  { email: 'Freddy@gmail.com',
    password: 'I also have a password'},
  { email: 'Yolo@gmail.com',
    password: 'yoloyoloyolo'}
];

module.exports.waypoints = ( function() {

  var results = [];

  for (var i = 1; i <= 3; i++) {
    results.push({
      longitude: Math.round( Math.random()*100000 ) / 100,
      latitude:  Math.round( Math.random()*100000 ) / 100
    });
  }
  return {userId: 1, waypoints: results};
})();

