'use strict'

var mongoose = require("mongoose");

// collab.startDate
// collab.completed

var collabSchema = mongoose.Schema({
	startDate: Date,
	completed: Boolean
});

var model = mongoose.model('Collab', collabSchema);

module.exports = model;