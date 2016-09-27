'use strict';

var mongoose = require("mongoose");

// user.firstName
// user.lastName
// user.email

var userSchema = new mongoose.Schema({
	username: {
		type: 'string',
		required: true
	},
	email: {
		type: 'string',
		required: true
	},
	password: {
		type: 'string',
		required: true
	},
	collabIds: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Collab"
		}
	]
});

var model = mongoose.model('User', userSchema);

module.exports = model;