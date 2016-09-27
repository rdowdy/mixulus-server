'use strict';

var mongoose = require("mongoose");

// sound.path
// sound.track
// sound.gridLocation
// sound.startMarker
// sound.endMarker

var soundSchema = new mongoose.Schema({
	path: String,
	track: Number
});

var model = mongoose.model('Sound', soundSchema);

module.exports = model;