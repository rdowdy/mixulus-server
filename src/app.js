'use strict';
var fs = require('fs');
var express = require('express');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwtVerifier = require('./passport/verify');
var cors = require('cors');

////////////////////////
// Environment Configuration
////////////////////////
var publicPath = process.env.PUBLIC_PATH;
console.log("Root path is: " + publicPath);

// initialize express
var app = express();

// connect to database
require('./database');

////////////////////////
// Middleware
////////////////////////
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb' }));
app.use(cookieParser());
app.use(express.static(publicPath));

////////////////////////
// Passport
////////////////////////

// Configure 
app.use(expressSession({
    secret: 'superDuperSecret',
    maxAge: 3600000
}));

// Initialize 
app.use(passport.initialize());
app.use(passport.session());
require('./passport/init')(passport);

////////////////////////
// API Routes
////////////////////////

var routes = require('./routes/index')(passport, publicPath);

// Use JWT verification to check API routes authorization
routes.use(jwtVerifier);

// Require the routing code
var collabRoute = require("./routes/collab.route.js");
var trackRoute = require("./routes/track.route.js");
var soundRoute = require("./routes/sound.route.js");
var userRoute = require("./routes/user.route.js");

// Use the routing code on these routes
routes.use("/collabs", collabRoute);
routes.use("/tracks", trackRoute);
routes.use("/sounds", soundRoute);
routes.use("/users", userRoute);

// Use API routes on app server
app.use(routes);

////////////////////////
// Start the App Server
////////////////////////
var port = process.env.PORT || 8080;
app.listen(port, "127.0.0.1", function() {
    console.log("The server is running on port " + port);
})

////////////////////////
// Socket server used for recording
////////////////////////
require("./record.js");

module.exports = app;
