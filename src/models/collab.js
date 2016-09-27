'use strict'

var mongoose = require("mongoose");

// collab.startDate
// collab.completed

var collabSchema = mongoose.Schema({
	startDate: {
		type: 'string',
		required: true
	},
	completed: {
		type: 'boolean',
		required: false
	},
	userIds: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "User"
		}
	],
	soundIds: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Sound"
		}
	]

});

var model = mongoose.model('Collab', collabSchema);

module.exports = model;