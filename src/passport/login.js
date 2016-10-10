var User = require('../models/user');
var bCrypt = require('bcrypt');
var LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport) {
    console.log("Initializing login strategy...");
    passport.use('login', new LocalStrategy(
    	{
    		passReqToCallback: true
    	},
    	function(req, email, password, done) {
    		console.log("Doing login");
    		// check to see if the email exists
    		// i'm using their email address as their sign-in
    		User.findOne({'email': email}, function(err, user) {
    			if(err) {
    				return done(err);
    			} else if(!user) {
    				console.log("User not found with email: " + email);
    				return done(null, false, req.flash("message", "Couldn't find user"))
    			}

    			if(!isValidPassword(user, password)) {
    				console.log('Invalid Password');
    				return done(null, false, req.flash('message', 'Invalid Password'));
    			}

    			// user and password both match, return
    			return done(null, user);
    		});
    	}
    ));

    function isValidPassword(user, password) {
        return bCrypt.compareSync(password, user.password);
    }

}
