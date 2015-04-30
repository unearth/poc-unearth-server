module.exports.users = [
  { username: 'Joe',
    password: 'mysecretpassword'},
  { username: 'Melony',
    password: 'ihaveasecurepassword'},
  { username: 'Brian',
    password: 'mysecrethashedpassword'},
  { username: 'Freddy',
    password: 'I also have a password'},
  { username: 'Yolo',
    password: 'yoloyoloyolo'}
];

module.exports.waypoints = (function() {

  var results = [];

  for(var i = 1; i <= 3; i++){
    results.push({
      userId: i,
      longitude: Math.round(Math.random()*100000) / 100,
      latitude: Math.round(Math.random()*100000) / 100
    });
  }
  return results;
})();

