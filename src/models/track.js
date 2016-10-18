'use strict'

var mongoose = require("mongoose");

// track.name
// track.gain
// track.collabIds
// track.soundIds

var trackSchema = mongoose.Schema({
    name: {
        type: 'string',
        required: true
    },
    gain: {
        type: 'number',
        required: true
    },
    collabId: {
        type: mongoose.Schema.ObjectId,
        ref: "Collab"
    },
    soundIds: [{
        type: mongoose.Schema.ObjectId,
        ref: "Sound"
    }]
});

var model = mongoose.model('Track', trackSchema);

module.exports = model;
