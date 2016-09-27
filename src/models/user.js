'use strict';

var mongoose = require("mongoose");

// user.firstName
// user.lastName
// user.email

var userSchema = new mongoose.Schema({
	username: String,
	firstName: String,
	lastName: String,
	email: String,
	password: String
});

var model = mongoose.model('User', userSchema);

module.exports = model;