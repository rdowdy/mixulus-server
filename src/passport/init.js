var login = require('./login');
var signup = require('./signup');
var User = require('../models/user');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;

module.exports = function(passport) {
    console.log("Initializing passport...");
    // Passport needs to be able to serialize and deserialize users to support persistent login sessions
    passport.serializeUser(function(user, done) {
        console.log('serializing user: ');
        console.log(user);
        done(null, user._id);
    });

    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            console.log('deserializing user:', user);
            done(err, user);
        });
    });

    var opts = {}
    opts.jwtFromRequest = ExtractJwt.fromBodyField();
    opts.secretOrKey = 'superDuperSecret';
    passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
        console.log('authenticating');
        User.findOne({ _id: jwt_payload.sub }, function(err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                // account found, now verify password

                return done(null, user);
            } else {
                // no account found
                return done(null, false);
            }
        });
    }));

    // Setting up Passport Strategies for Login and SignUp/Registration
    login(passport);
    signup(passport);
}
