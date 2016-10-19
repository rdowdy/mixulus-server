'use strict';

var mongoose = require('mongoose');

var db_url = process.env.MONGO_DB_URL;

mongoose.connect(db_url, function(err) {
	if(err) {
		console.log("Theres was an error");
	} else {
		console.log("Congrats, you're connected!");
	}
});