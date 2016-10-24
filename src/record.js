var fs = require('fs');
var express = require('express');
var passport = require('passport');
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var jwtVerifier = require('./passport/verify');
var cors = require('cors');

/////////////////////////////
// Environment Configuration
/////////////////////////////
var production = process.env.PRODUCTION == 'true';
var port = 9998;
var ip = "127.0.0.1";

var corsOptions = {
    credentials: true
};

if(production) {
    corsOptions.origin = "https://mixulus.com";
} else { // dev mode
    corsOptions.origin = "https://localhost:8080";
}

/////////////////////////////
// Set up the server
/////////////////////////////
var socket_app = express();

// middleware
socket_app.use(require('morgan')('dev'));
socket_app.use(cors(corsOptions));
socket_app.use(bodyParser.urlencoded({ extended: false }));
socket_app.use(express.static('static'));

// start the server
var socket_server = socket_app.listen(port, ip, function() {
    console.log("The socket server is running on ip " + ip +  " at port " + port);
});

/////////////////////////////
// Set up the socket namespace
/////////////////////////////
var cfg = production ? { path: "/record" } : {};
var io = require('socket.io')(socket_server, cfg);

var nsp;
if(production) {
    nsp = io.of('/record');
} else { // dev mode
    nsp = io;
}

/////////////////////////////
// Set up the recording events
/////////////////////////////
var recSessions = {};
var bitDepth = 16;
var pcmFilesPath = "server/sounds/"

nsp.on('connection', function(socket) {
    // this event marks the beginning of a recording session
    socket.on('start', function(data) {
        recSessions[data.id] = {};
        recSessions[data.id].recLen = 0; // total number of samples recorded
        recSessions[data.id].queue = []; // queue of audio buffers

        socket.emit("ready", cfg);
    });

    // push an audio buffer to a user's recording queue
    socket.on('queue', function(data) {
        recSessions[data.id].recLen += data.bufferLen;
        
        var buffer = {
            buffer: data.buffer,
            bufferNum: data.bufferNum
        }
        // include the array length so objToArray can convert
        buffer.buffer.len = data.bufferLen;

        recSessions[data.id].queue.push(buffer);

    });

    // stop the recording session: 
    //   - check for missing buffers
    //   - merge and write the audio buffers
    socket.on('stop', function(data) {
        // check to make sure we have the right amount of buffers
        if(data.numBuffers != recSessions[data.id].queue.length) {
            console.log("HEY WE GOT A PROBLEM");
        }

        ////////////////
        // merge the buffers
        var mergedBuffers = mergeBufferPackets(recSessions[data.id].queue, recSessions[data.id].recLen);
        
        // now we need to turn the mergedBuffers into
        // an actual buffer
        var actualBuffer = new Buffer(mergedBuffers.length * bitDepth);
        for(var i = 0; i < mergedBuffers.length; i++){
            //write the float in Big-Endian and move the offset
            actualBuffer.writeFloatBE(mergedBuffers[i], i * bitDepth);
        }

        ////////////////
        // write to the PCM file
        var wstream = fs.createWriteStream(pcmFilesPath + data.id + '.pcm');
        wstream.write(actualBuffer, function(err) {
            // close it on err
            wstream.end();
        });

        wstream.end();
    });
});

/////////////////////////////
// Helper Functions
/////////////////////////////
function mergeBufferPackets(bufferPackets, length) { 
    // merge the packet objects into an array of arrays
    var buffers = [];
    for(var i = 0; i < bufferPackets.length; i++) {
        buffers[bufferPackets[i].bufferNum] = bufferPackets[i].buffer;
    }

    // merge the 2-d array into a 1-d array
    var result = new Float32Array(length);
    var offset = 0;
    for (var i = 0; i < buffers.length; i++) {
    	var arr = objToArray(buffers[i]);
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