'use strict';

var clientPath = "/Users/rdowdy/dev/OCA/final_proj/client/app/";

var express = require('express');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// initialize express
var app = express();

// initialize database and seed it
require('./database');

// use body parser and cookie parser
// and set the base path to serve static files from
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(clientPath));

/////////////////////////////
// Passport

// configuring passport
app.use(expressSession(
	{
		secret: 'superDuperSecret',
		maxAge: 3600000
	}
));
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

/////////////////////////////

/////////////////////////////
// Set up routes

var routes = require('./routes/index')(passport, clientPath);

var collabRoute = require("./routes/collab.route.js");
routes.use("/collabs", collabRoute);

var soundRoute = require("./routes/sound.route.js");
routes.use("/sounds", soundRoute);

app.use(routes);

// start up the server
app.listen(3000, function() {
	console.log("The server is running on port 3000!");
})

module.exports = app;