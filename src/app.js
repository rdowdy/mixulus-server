'use strict';

var publicPath = process.env.PUBLIC_PATH;
console.log("Root path is: " + publicPath);

var fs = require('fs');
var express = require('express');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwtVerifier = require('./passport/verify');
var cors = require('cors');

// initialize express
var app = express();

// initialize database and seed it
require('./database');

// use body parser and cookie parser
// and set the base path to serve static files from
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb' }));
app.use(cookieParser());
app.use(express.static(publicPath));

/////////////////////////////
// Passport

// configuring passport
app.use(expressSession({
    secret: 'superDuperSecret',
    maxAge: 3600000
}));
app.use(passport.initialize());
app.use(passport.session());

// flash middleware
// var flash = require('connect-flash');
// app.use(flash());

// Initialize Passport
var initPassport = require('./passport/init');
initPassport(passport);

/////////////////////////////

/////////////////////////////
// Set up routes

var routes = require('./routes/index')(passport, publicPath);

/* Use JWT verify middlware to authenticate API endpoint routes */
routes.use(jwtVerifier);

var collabRoute = require("./routes/collab.route.js");
routes.use("/collabs", collabRoute);

var trackRoute = require("./routes/track.route.js");
routes.use("/tracks", trackRoute);

var soundRoute = require("./routes/sound.route.js");
routes.use("/sounds", soundRoute);

var userRoute = require("./routes/user.route.js");
routes.use("/users", userRoute);

app.use(routes);

// start up the server
var port = process.env.PORT || 8080;
app.listen(port, "127.0.0.1", function() {
    console.log("The server is running on port " + port);
})

// the socket server takes care of a user's recording session
var socketServer = require("./record.js");

module.exports = app;
