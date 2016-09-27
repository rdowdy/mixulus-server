var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
var bCrypt = require('bcrypt');

module.exports = function(passport) {
	passport.use('signup', new LocalStrategy(
		{
			passReqToCallback: true
		}, 
		function(req, email, password, done) {
			findOrCreateUser = function() {
				// find a user in Mongo
				User.findOne({'email': email}, function(err, user) {
					if(err) {
						console.log("Error in signup: " + err);
						return done(err)
					} else if(user) {
						// there's already an account associated with this email
						console.log("User already exists");
						return done(null, false, req.flash("message", "User already exists"));
					} else {
						// since there's no user found
						// we can create the account
						var newUser = new User();

						newUser.email = email;
						newUser.password = createHash(password);
						newUser.username = req.param("username");
						newUser.firstName = req.param("firstName");
						newUser.lastName = req.param("lastName");

						// save the user
						newUser.save(function(err) {
							if(err) {
								console.log("Couldn't save the user: " + err);
								throw err;
							} 

							console.log("User registration successful");
							return done(null, newUser);
						});
					}
				});
			};
			process.nextTick(findOrCreateUser);
		}
	));

	function createHash(password) {
			return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	}
}


