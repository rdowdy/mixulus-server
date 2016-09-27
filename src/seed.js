'use strict';

var User = require("./models/user.js");
console.log("Seeding database...");

// Seed the users
var users = [
	{
		firstName: "Ryan",
		lastName: "Dowdy",
		email: "rdowdy21@gmail.com"
	},
	{
		firstName: "Adam",
		lastName: "Angular",
		email: "angular@brackets.com"
	},
	{
		firstName: "Marsha",
		lastName: "Mongo",
		email: "mongo@db.com"
	},
	{
		firstName: "Erin",
		lastName: "Express",
		email: "erin@express.com"
	},
	{
		firstName: "Ned",
		lastName: "Node",
		email: "ned@node.js"
	}
];

users.forEach(function(user, index) {
	User.find({'email': user.email}, function(err, users) {
		if(!err && users.length == 0) {
			User.create(user);
		}
	});
})