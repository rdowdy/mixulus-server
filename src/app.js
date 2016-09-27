'use strict';

var clientPath = "/Users/rdowdy/dev/OCA/final_proj/client/app";

var express = require('express');
var router = require('./api');

var app = express();

require('./database');
require('./seed');

app.use('/', express.static(clientPath));

app.use('/api', router);

app.listen(3000, function() {
	console.log("The server is running on port 3000!");
})