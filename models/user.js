var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var userSchema = mongoose.Schema({
  username: {
    type: String
  },
  email: {
    type: String
  },
  password: {
    type: String,
    bcrypt: true
  },
  type: {                     // student or instructor
    type: String
  }
});

var User = module.exports = mongoose.model('User', userSchema);

// Get User by ID
module.exports.getUserById = function(id, callback) {
  User.findById(id, callback);
}

// Get User by Name
module.exports.getUserByUsername = function(username, callback) {
  var query = { username: username };
  User.findOne(query, callback);
}

// Save Student
module.exports.saveStudent = function(newUser, newStudent, callback) {
  bcrypt.hash(newUser.password, 10, function(err, hash){
    if (err) throw err;
    // Set hash
    newUser.password = hash;
    console.log('Student is being saved');
    // Updating both the user and student collection
    async.parallel([newUser.save, newStudent.save], callback);
  });
}

// Save Instructor
module.exports.saveInstructor = function(newUser, newInstructor, callback) {
  bcrypt.hash(newUser.password, 10, function(err, hash){
    if (err) throw err;
    // Set hash
    newUser.password = hash;
    console.log('Instructor is being saved');
    // Updating both the user and instructor collection
    async.parallel([newUser.save, newInstructor.save], callback);
  });
}

// Compare password
module.exports.comparePassword = function(candidatePassword, hash, callback) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    if (err) throw err;
    callback(null, isMatch);
  });
}