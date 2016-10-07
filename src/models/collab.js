'use strict'

var mongoose = require("mongoose");

// collab.startDate
// collab.completed

var collabSchema = mongoose.Schema({
	name: {
		type: 'string',
		required: true
	},
	startDate: {
		type: 'date',
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
	trackIds: [
		{
			type: mongoose.Schema.ObjectId,
			ref: "Track"
		}
	]

});

var model = mongoose.model('Collab', collabSchema);

module.exports = model;