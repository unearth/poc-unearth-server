var bcrypt = require('bcrypt-nodejs');
var jwt = require('jwt-simple');

var secret = 'thisisjustourlittlesecret';

module.exports.hash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports.validPassword = function(newPassword, storedPassword) {
  return bcrypt.compareSync(newPassword, storedPassword);
};

module.exports.encodeToken = function(payload) {
  return jwt.encode(payload, secret);
};

module.exports.decodeToken = function(token) {
  return jwt.decode(token, secret);
};

