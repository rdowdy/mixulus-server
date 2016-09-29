var express = require("express");
var router = express.Router();
var User = require("../models/user");

router.route("/")

	//GET: /users
	.get(function(req, res) {

	})

	//POST: /users
	.post(function(req, res) {

	})

router.route("/:id")

	//GET: /users/:id
	.get(function(req, res) {

	})

	//PUT: /users/:id
	.put(function(req, res) {

	})

	//DELETE: /users/:id
	.delete(function(req, res) {

	})

module.exports = router;