'use strict';

var mongoose = require('mongoose');

var db_name = "collabio";

mongoose.connect('mongodb://localhost/' + db_name, function(err) {
	if(err) {
		console.log("Theres was an error");
	} else {
		console.log("Congrats, you're connected!");
	}
});