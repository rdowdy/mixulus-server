var express = require("express");
var router = express.Router();
var Track = require("../models/track");

router.route("/")
	//POST: /tracks
	.post(function(req, res) {
		var track = new Track();

		track.name = req.body.name;
		track.gain = req.body.gain;
		
		track.save(function(err, track) {
			if(err) {
				return res.send(500, err);
			}

			res.json(track);
		})
	});

module.exports = router;