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

module.exports.groups = [
  { "name": "Hello World",
  "description": "This is a description",
  "emails": ["Melony@gmail.com"] },
  { "name": "Hello World 2",
  "description": "This is a descriptionz",
  "emails": ["Melony@gmail.com, Joe@gmail.com"] },
  { "name": "Hello World 3",
  "description": "This is a descriptionzz",
  "emails": ["Melony@gmail.com, Joe@gmail.com"] },
  { "name": "Hello World 4",
  "description": "This is a descriptionzzz",
  "emails": ["Melony@gmail.com, Joe@gmail.com"] },
  { "name": "Hello World 5",
  "description": "This is a descriptionzzzz",
  "emails": ["Melony@gmail.com, Joe@gmail.com"] },
];

module.exports.waypoints = function(userId) {

  var results = [];

  for (var i = 1; i <= 3; i++) {
    results.push(
      [
        Math.round( Math.random()*100000 ) / 100,
        Math.round( Math.random()*100000 ) / 100
      ]
    );
  }
  return {userId: userId, waypoints: results};
};

