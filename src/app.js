'use strict';

var clientPath = "/Users/rdowdy/dev/OCA/final_proj/client/app/";

var express = require('express');
var apiRouter = require('./api');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// initialize express
var app = express();

// initialize database and seed it
require('./database');
require('./seed');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//app.use(cookieParser());
app.use(express.static(clientPath));

// configuring passport
app.use(expressSession({secret: 'superDuperSecret'}));
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
var flash = require('connect-flash');
app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport, clientPath);
app.use('/', routes);


// set the API router to serve on the /api path
app.use('/api', apiRouter);

// start up the server
app.listen(3000, function() {
	console.log("The server is running on port 3000!");
})

module.exports = app;