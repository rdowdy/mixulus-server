'use strict';

var mongoose = require("mongoose");
var Track = require('./track');

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
	filePath: {
		type: 'string',
		required: false
	},
	gridLocation: {
		type: 'number',
		required: false
	},
	frameLength: {
		type: 'number',
		required: false
	},
	fps: {
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