'use strict';

var mongoose = require("mongoose");

// sound.path
// sound.track
// sound.gridLocation
// sound.startMarker
// sound.endMarker

var soundSchema = new mongoose.Schema({
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
		required: false
	},
	endMarker: {
		type: 'number',
		required: false
	},
	trackId: {
		type: mongoose.Schema.ObjectId,
		ref: "Track"
	}
});

var model = mongoose.model('Sound', soundSchema);

module.exports = model;