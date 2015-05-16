module.exports.users = [
  { email: 'Joe@gmail.com',
    name: 'Joe',
    password: 'mysecretpassword'},
  { email: 'Melony@gmail.com',
    name: 'Melony',
    password: 'ihaveasecurepassword'},
  { email: 'Brian@gmail.com',
    name: 'Brian',
    password: 'mysecrethashedpassword'},
  { email: 'Freddy@gmail.com',
    name: 'Freddy',
    password: 'I also have a password'},
  { email: 'Yolo@gmail.com',
    name: 'Yolosw4g',
    password: 'yoloyoloyolo'}
];

module.exports.waypoints = ( function() {

  var results = [];

  for (var i = 1; i <= 3; i++) {
    results.push(
      [
        Math.round( Math.random()*100000 ) / 100,
        Math.round( Math.random()*100000 ) / 100
      ]
    );
  }
  return {userId: 1, waypoints: results};
})();

