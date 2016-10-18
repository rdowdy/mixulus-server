'use strict';

var mongoose = require('mongoose');

var db_url = "mongodb://app:imGoingBack2505@52.70.144.221:27017/collabio";

mongoose.connect(db_url, function(err) {
	if(err) {
		console.log("Theres was an error");
	} else {
		console.log("Congrats, you're connected!");
	}
});