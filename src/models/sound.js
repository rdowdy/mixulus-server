'use strict';

var mongoose = require("mongoose");

// sound.path
// sound.track
// sound.gridLocation
// sound.startMarker
// sound.endMarker

var soundSchema = new mongoose.Schema({
	path: {
		type: 'string',
		required: true
	},
	track: {
		type: 'number',
		required: true
	},
	gridLocation: {
		type: 'number',
		required: true
	},
	startMarker: {
		type: 'number',
		required: true
	},
	endMarker: {
		type: 'number',
		required: true
	},
	collabId: {
		type: mongoose.Schema.ObjectId,
		ref: "Collab"
	}
});

var model = mongoose.model('Sound', soundSchema);

module.exports = model;