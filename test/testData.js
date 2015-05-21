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
  { "groupName": "Hello World",
  "groupDescription": "This is a groupDescription",
  "emails": ["Brian@gmail.com"] },
  { "groupName": "Hello World 2",
  "groupDescription": "This is a groupDescriptionz",
  "emails": ["Brian@gmail.com, Joe@gmail.com"] },
  { "groupName": "Hello World 3",
  "groupDescription": "This is a groupDescriptionzz",
  "emails": ["Brian@gmail.com, Joe@gmail.com"] },
  { "groupName": "Hello World 4",
  "groupDescription": "This is a groupDescriptionzzz",
  "emails": ["Brian@gmail.com, Joe@gmail.com"] },
  { "groupName": "Hello World 5",
  "groupDescription": "This is a descriptionzzzz",
  "emails": ["Brian@gmail.com, Joe@gmail.com"] },
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

