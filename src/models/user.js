'use strict';

var mongoose = require("mongoose");

// user.firstName
// user.lastName
// user.email

var userSchema = new mongoose.Schema({
	firstName: String,
	lastName: String,
	email: String
});

var model = mongoose.model('User', userSchema);

module.exports = model;