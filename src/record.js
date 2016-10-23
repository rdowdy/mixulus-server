var fs = require('fs');
var express = require('express');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwtVerifier = require('./passport/verify');
var cors = require('cors');

var corsOptions = {
    origin: "http://localhost:8080",
    credentials: true
};

var socket_app = express();
socket_app.use(require('morgan')('dev'));
socket_app.use(cors(corsOptions));
socket_app.use(bodyParser.urlencoded({ extended: false }));
socket_app.use(express.static('static'));

var port = 9998;
var socket_server = socket_app.listen(port, "127.0.0.1", function() {
    console.log("socket_app is running on port " + port);
});

var wstream;
var recBuffers;
var tempBuffer;
var recLen;
var soundWritePath = "server/sounds/"

var io = require('socket.io')(socket_server/*, { path: "/record" }*/);

io/*.of('/record')*/.on('connection', function(socket) {

    console.log("A user connected");
    socket.on('start record', function(data) {
        console.log("starting a recording session for " + data.id);
        wstream = fs.createWriteStream(soundWritePath + data.id + '.pcm');

        recBuffers = [];
        recLen = 0;

        socket.emit("ready", {path: "/record"});
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
        wstream.write(actualBuffer, function(err) { wstream.end(); });
        // write to stream
        //wstream.end();
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

module.exports = socket_app;