var bcrypt   = require('bcrypt-nodejs');

// Generates a hash
exports.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// Checks if password is valid
exports.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};

exports.methods.validateEmail = function(email) {
  // Search user by email
  db.getLocalUser(email, function(error, rows) {
    if(error){
      return done(error);
    }

    if(rows.length > 0){
      // Auth doesn't pass!
    } else{
      // Auth passes!
      db.insertLocalUser(/*local.email, generateHash(password)*/);
    }
  });
};
