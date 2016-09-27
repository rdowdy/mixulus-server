'use strict';

var clientPath = "/Users/rdowdy/dev/OCA/final_proj/client/app";

var express = require('express');
var apiRouter = require('./api');

// initialize express
var app = express();

// initialize database and seed it
require('./database');
require('./seed');

// configuring passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: 'superDuperSecret'}));
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
var flash = require('connect-flash');
app.use(flash());

// set where to serve static files from
app.use('/', express.static(clientPath));
// set the API router to serve on the /api path
app.use('/api', apiRouter);

// start up the server
app.listen(3000, function() {
	console.log("The server is running on port 3000!");
})