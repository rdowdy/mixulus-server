var authRoute = require('../passport/authenticate');
var express = require('express');
var JwtStrategy = require('passport-jwt').Strategy;
var router = express.Router();

var isAuthenticated = function(req, res, next) {
    return next();
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect them to the login page
    res.redirect('/');
}

module.exports = function(passport, path) {
    ////////////////////////
    // Main App Routes
    ////////////////////////

    // GET /login
    router.get('/', function(req, res) {
        // Display the Login page
        res.sendFile("login.html", { root: path });
    });

    // GET /home
    router.get('/home', isAuthenticated, function(req, res) {
        // Send the user's home page (add collab, list existing collabs)
        res.sendFile("features/home/home.html", { root: path });
    });

    // GET /workspace
    router.get('/workspace', isAuthenticated, function(req, res) {
        // Music production workspace
        res.sendFile("features/workspace/workspace.html", { root: path });
    });
    
    ////////////////////////
    // Authentication & Authorization
    ////////////////////////    

    // POST /signup
    // : this also starts a session with the user
    router.post('/signup', 
        passport.authenticate('signup'),
        function(req, res) {
            req.user.password = null;
            res.send(200, {success: true, user: req.user});
        });

    // POST /login
    // : this starts a session with the user
    router.post('/login',
    	passport.authenticate('login'),
        function(req, res) {
            req.user.password = null;
            res.send(200, {success: true, user: req.user});
        });

    // POST /authenticate
    // : this generates a JWT for the user
    router.post('/authenticate', authRoute);

    // GET /signout
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
