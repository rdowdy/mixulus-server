var express = require('express');
var JwtStrategy = require('passport-jwt').Strategy;
var router = express.Router();

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	console.log(req);
	res.redirect('/');
}

module.exports = function(passport, path){

	/* GET login page. */
	router.get('/', function(req, res) {
    	// Display the Login page with any flash message, if any
		//res.sendFile("index.html", {root: path});
		console.log("Serving login.html")
		res.sendFile("login.html", {root: path});
	});

	/* Handle Login POST */
	router.post('/login', 
		passport.authenticate('login', {
			successRedirect: '/home',
			failureRedirect: '/'
		}));

	/* GET Registration Page */
	router.get('/signup', function(req, res){
		console.log("Registration page");
		//res.render('register',{message: req.flash('message')});
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/',
		failureFlash : true  
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function(req, res){
		res.sendFile("features/home/home.html", {root: path});
	});

	/* GET Workspace Page */
	router.get('/workspace', isAuthenticated, function(req, res) {
		res.sendFile("features/workspace/workspace.html", {root: path});
	});

	/* Handle Logout */
	router.get('/signout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	return router;
}




