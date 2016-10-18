var express = require("express");
var router = express.Router();
var User = require("../models/user");

router.route("/")

	//GET: /users
	// .get(function(req, res) {
	// 	User
	// 		.find()
	// 		.populate('collabIds', '_id completed')
	// 		.exec(function(err, users) {
	// 			if(err) {
	// 				res.send(500, err);
	// 			}

	// 			res.json(users);
	// 		})
	// })

	//POST: /users is reserved for auth /signup

router.route("/:id")

	//GET: /users/:id
	// .get(function(req, res) {

	// })

	//PUT: /users/:id
	// .put(function(req, res) {

	// })

	//DELETE: /users/:id
	// .delete(function(req, res) {

	// })

router.route("/search/:username")
	//GET: /users/search/:username
	.get(function(req, res) {
		var username = req.params.username;

		User.findOne({username: username}, function(err, user) {
			if(err) {
				return res.send(500, err);
			}

			if(user == null) {
				res.send(200, {_id: null})
			} else {
				res.send(200, {_id: user._id});
			}
		})
	})

module.exports = router;