var express = require("express");
var router = express.Router();
var Sound = require("../models/sound");

router.route("/")

	//GET: /sounds
	.get(function(req, res) {
		Sound.find(function(err, sound) {
			if(err) {
				return res.send(500, err);
			}

			res.json(sound);
		})
	})

	//POST: /sounds
	.post(function(req, res) {
		var sound = new Sound();

		sound.track = req.body.track;
		sound.gridLocation = req.body.gridLocation;
		sound.startMarker = req.body.startMarker;
		sound.endMarker = req.body.endMarker;
		sound.trackId = req.body.trackId;

		sound.save(function(err, sound) {
			if(err) {
				return res.send(500, err);
			}

			res.json(sound);
		})
	})

router.route("/:id")

	//GET: /sounds/:id
	.get(function(req, res) {
		Sound.findById(req.params.id, function(err, sound) {
			if(err) {
				return res.send(500, err);
			}

			res.json(sound);
		})
	})

	//PUT: /sounds/:id
	.put(function(req, res) {
		Sound.findById(req.params.id, function(err, sound) {
			if(err) {
				return res.send(500, err);
			}

			sound.track = req.body.track;
			sound.gridLocation = req.body.gridLocation;
			sound.startMarker = req.body.startMarker;
			sound.endMarker = req.body.endMarker;
			sound.trackId = req.body.trackId;

			sound.save(function(err, savedSound) {
				if(err) {
					return res.send(500, err);
				}

				res.json(savedSound);
			})	
		})
	})

	//DELETE: /sounds/:id
	.delete(function(req, res) {
		Sound.remove({_id: req.params.id}, function(err, sound) {
			if(err) {
				return res.send(500, err);
			}

			res.json(sound);
		})
	})

module.exports = router;