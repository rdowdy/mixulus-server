var express = require("express");
var router = express.Router();
var Sound = require("../models/sound");

router.route("/")

	//GET: /sounds
	.get(function(req, res) {

	})

	//POST: /sounds
	.post(function(req, res) {

	})

router.route("/:id")

	//GET: /sounds/:id
	.get(function(req, res) {

	})

	//PUT: /sounds/:id
	.put(function(req, res) {

	})

	//DELETE: /sounds/:id
	.delete(function(req, res) {

	})

module.exports = router;