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
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function(passport, path) {
    /* GET login page. */
    router.get('/', function(req, res) {
        // Display the Login page with any flash message, if any
        res.sendFile("login.html", { root: path });
    });

    // /* Handle Login POST */
    router.post('/login',
    	passport.authenticate('login'),
        function(req, res) {
            req.user.password = null;
            res.send(200, {success: true, user: req.user});
        });

    /* Handle Registration POST */
    router.post('/signup', 
        passport.authenticate('signup'),
        function(req, res) {
            req.user.password = null;
            res.send(200, {success: true, user: req.user});
        });

    /* Sign a user in and send JWT */
    router.post('/authenticate', authRoute);

    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res) {
        console.log("HOME");
        res.sendFile("features/home/home.html", { root: path });
    });

    /* GET Workspace Page */
    router.get('/workspace', isAuthenticated, function(req, res) {
        res.sendFile("features/workspace/workspace.html", { root: path });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
