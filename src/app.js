'use strict';

var publicPath = process.env.PUBLIC_PATH;

var fs = require('fs');
var express = require('express');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwtVerifier = require('./passport/verify');

// initialize express
var app = express();

// initialize database and seed it
require('./database');

// use body parser and cookie parser
// and set the base path to serve static files from
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb' }));
app.use(cookieParser());
app.use(express.static(awsPath));

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

var routes = require('./routes/index')(passport, awsPath);

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
app.listen(process.env.PORT || 80, function() {
    console.log("The server is running on port 3000!");
})

/////////////////////////////
// Socket.IO Stuff

var socket_app = express();
var socket_server = socket_app.listen(9999, function() {
    console.log("socket_app is running on port 9999");
});

var io = require('socket.io')(socket_server);

socket_app.use(bodyParser.urlencoded({ extended: false }));
socket_app.use(express.static('static'));

var wstream;
var recBuffers;
var recLen;
var soundWritePath = "server/sounds/"

io.on('connection', function(socket) {
    console.log("A user connected");
    socket.on('start record', function(data) {
        console.log("starting a recording session for " + data.id);
        wstream = fs.createWriteStream(soundWritePath + data.id + '.pcm');
        recBuffers = [];
        recLen = 0;
    });

    socket.on('audio buffer', function(data) {
        data.buffer.len = data.bufferLen;
        recBuffers[data.bufferNum] = data.buffer;
        recLen += data.bufferLen;
    });

    socket.on('done record', function(data) {
        console.log("ending recording session for " + data.id);
        // merge buffers 
        var writeBuffer = mergeBuffers(recBuffers, recLen);
    	// now we need to turn the writeBuffer into
    	// an actual buffer
    	// 8 bytes per float
    	var actualBuffer = new Buffer(writeBuffer.length * 16);
    	for(var i = 0; i < writeBuffer.length; i++){
        	//write the float in Little-Endian and move the offset
        	actualBuffer.writeFloatBE(writeBuffer[i], i*16);
    	}
    	wstream.write(actualBuffer);
        // write to stream
        wstream.end();
    });
});

function mergeBuffers(buf, length) {
    var result = new Float32Array(length);
    var offset = 0;
    for (var i = 0; i < buf.length; i++) {
    	var arr = objToArray(buf[i]);
        // put recBuffer[i] values into result
        // at position {offset}
        result.set(arr, offset);
        offset += arr.length;
    }

    return result;
}

function objToArray(bufObj) {
	var len = bufObj.len;
	var out = new Float32Array(len);
	for(var i = 0; i < len; i++) {
		out[i] = bufObj[i];
	}

	return out;
}

module.exports = app;
