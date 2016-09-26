'use strict'

var express = require('express');
var router = express.Router();
var User = require("../models/user");

var router = express.Router();

router.get("/users", function(req, res) {
	User.find({}, function(err, users) {
		if(err) {
			// do something
			res.status(500).json({message: err.message});
		} else {
			res.json({users: users});
		}
	})
})

module.exports = router;