var express = require("express");
var router = express.Router();
var passport = require('passport');
var Collab = require("../models/collab");
var User = require("../models/user");
var Track = require("../models/track");

router.route("/")

	//GET: /collabs
	.get(function(req, res) {
			var userId = req.decoded._doc._id;
			Collab
				.find()
				.populate('userIds', '_id username')
				.find({userIds: userId})
				.exec(function(err, collabs) {
					if(err) {
						return res.send(500, err);
					}

					res.json(collabs);
				});
		})

	//POST: /collabs
	.post(function(req, res) {
		var collab = new Collab();
		var userId = req.decoded._doc._id;

		collab.name = req.body.name;
		collab.startDate = req.body.startDate;
		collab.completed = req.body.completed;
		collab.userIds = [];
		collab.userIds.push(userId);

		collab.save(function(err, collab) {
			if(err) {
				return res.send(500, err);
			}

			User.findById(userId, function(err, user) {
				if(err) {
					return res.send(500, err);
				}

				user.save(function(err, user) {
					if(err) {
						return res.send(500, err);
					}

					res.json(collab);
				})
			})
		})
	})

router.route("/:id")	
	//GET: /collabs/:id
	.get(function(req, res) {
		Collab
			.findById(req.params.id)
			.populate('userIds', '_id username')
			.populate('trackIds')
			.exec(function(err, collab) {
				if(err) {
					return res.send(500, err);
				}

				// check to make sure the user is part of the collab
				if(checkUserIsAllowed(collab.userIds, req.decoded._doc._id, collab.currentUserIndex)) {
					res.json(collab);
				} else {
					console.log("GET /collabs/:id forbidden request")
					return res.send(403, "Unauthorized");
				}
			});
	})

	//PUT: /collabs/:id
	.put(function(req, res) {
		Collab.findById(req.params.id, function(err, collab) {
			if(err) {
				return res.send(500, err);
			}

			// check to make sure the user is part of the collab
			if(checkUserIsAllowed(collab.userIds, req.decoded._doc._id, collab.currentUserIndex)) {
				collab.startDate = req.body.startDate;
				collab.completed = req.body.completed;
				collab.name = req.body.name;

				collab.save(function(err, savedCollab) {
					if(err) {
						return res.send(500, err);
					}

					res.json(savedCollab);
				})
			} else {
				return res.send(403);
			}

		});
	})

	//DELETE: /collabs/:id
	.delete(function(req, res) {
		Collab.remove({_id: req.params.id}, function(err, collab) {
			if(err) {
				return res.send(500, err);
			}

			// check to make sure the user is part of the collab
			if(checkUserIsAllowed(collab.userIds, req.decoded._doc._id, collab.currentUserIndex)) {
				res.json(collab);
			} else {
				return res.send(403);
			}
		})
	});

router.route("/[0-9A-Fa-f]{24}/:userId")
	//POST: /collabs/:collabId/:userId
	.post(function(req, res) {
		Collab.findById(req.params.collabId, function(err, collab) {
			if(err) {
				return res.send(500, err);
			}

			// check to make sure the user is part of the collab
			if(checkUserIsAllowed(collab.userIds, req.decoded._doc._id, collab.currentUserIndex)) {
				User.findById(req.params.userId, function(err, user) {
					if(err) {
						return res.send(500, err);
					}

					collab.userIds.push(user._id);
					user.collabIds.push(collab._id);
					collab.save(function(err, collab) {
						if(err) {
							return res.send(500, err);
						}

						user.save(function(err, user) {
							res.json(collab);
						})
					});
				})
			} else {
				return res.send(403);
			}
		})
	})

	//DELETE: /collabs/:collabId/:userId
	.delete(function(req, res) {
		Collab.findById(req.params.collabId, function(err, collab) {
			if(err) {
				return res.send(500, err);
			}

			// check to make sure the caller of this API endpoint is part of the collab
			if(checkUserIsAllowed(collab.userIds, req.decoded._doc._id, collab.currentUserIndex)) {
				User.findById(req.params.userId, function(err, user) {
					if(err) {
						return res.send(500, err);
					}

					var idx = collab.userIds.indexOf(user._id);
					collab.userIds.splice(idx, 1);
					collab.save(function(err, collab) {
						res.json(collab);
					});
				})
			} else {
				return res.send(403);
			}
		})
	});

router.route("/:collabId/tracks/:trackId")
	.post(function(req, res) {
		Collab.findById(req.params.collabId, function(err, collab) {
			if(err) {
				return res.send(500, err);
			}

			// check to make sure the user is part of the collab
			if(checkUserIsAllowed(collab.userIds, req.decoded._doc._id, collab.currentUserIndex)) {
				Track.findById(req.params.trackId, function(err, track) {
					if(err) {
						return res.send(500, err);
					}

					collab.trackIds.push(track._id);
					track.collabId = collab._id;
					track.save(function(err, track) {
						if(err) {
							return res.send(500, err);
						}

						collab.save(function(err, collab) {
							res.json(collab);
						})
					})
				})
			} else {
				return res.send(403);
			}

		})
	});

	router.route("/commit/:collabId")
		.post(function(req, res) {
			Collab.findById(req.params.collabId, function(err, collab) {
				if(err) {
					console.log(err);
					return res.send(500, err);
				}

				if(checkUserIsAllowed(collab.userIds, req.decoded._doc._id, collab.currentUserIndex)) {

					collab.currentUserIndex++;

					if(collab.currentUserIndex == collab.userIds.length) {
						collab.currentUserIndex = 0;
					}

					collab.save(function(err, collab) {
						if(err) {
							return res.send(500, err);
						}

						res.json(200, {currentUserIndex: collab.currentUserIndex});
					})
				} else {
					return res.send(403);
				}
			})
	});

function checkUserIsAllowed(userIds, id, currentUserIndex) {
	var currentUserId = userIds[currentUserIndex]._id || userIds[currentUserIndex];
	if(currentUserId != id) {
		return false;
	}

	for(var i = 0; i < userIds.length; i++) {
		var idToCheck = userIds[i]._id || userIds[i];
		if(idToCheck == id) {
			return true;
		}
	}

	return false;
}
module.exports = router;