var bcrypt = require('bcrypt-nodejs');

module.exports.hash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

module.exports.validPassword = function(newPassword, storedPassword) {
  return bcrypt.compareSync(newPassword, storedPassword);
};
