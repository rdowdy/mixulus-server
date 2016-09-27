'use strict';

var clientPath = "/Users/rdowdy/dev/OCA/final_proj/client/app";

var express = require('express');
var router = require('./api');

// initialize express
var app = express();

// initialize database and seed it
require('./database');
require('./seed');

// set the root path
app.use('/', express.static(clientPath));
// set the api path
app.use('/api', router);

// start up the server
app.listen(3000, function() {
	console.log("The server is running on port 3000!");
})