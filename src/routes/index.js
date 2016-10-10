var authRoute = require('../passport/authenticate');
var express = require('express');
var JwtStrategy = require('passport-jwt').Strategy;
var router = express.Router();
var jwtVerifier = require('../passport/verify');

var isAuthenticated = function(req, res, next) {
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
    // router.post('/login',
    // 	passport.authenticate('login', { session: false }),
    // 	function(req, res) {
    //            var token = jwt.encode(req.user._id, 'superDuperSecret');
    //            res.status(200).json({ state: 'success', token: token, user: req.user.username ? req.user : null });
    //        });

    /* Handle Registration POST */
    router.post('/signup', passport.authenticate('signup', {
        successRedirect: '/home',
        failureRedirect: '/'
    }));

    /* Sign a user in and send JWT */
    router.post('/authenticate', authRoute);

    /* Use JWT verify middlware to authenticate home, workspace, and signout routes */
    router.use(jwtVerifier);

    /* GET Home Page */
    router.get('/home', function(req, res) {
        res.sendFile("features/home/home.html", { root: path });
    });

    /* GET Workspace Page */
    router.get('/workspace', function(req, res) {
        res.sendFile("features/workspace/workspace.html", { root: path });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    return router;
}
