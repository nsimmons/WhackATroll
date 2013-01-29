"use strict";

var socketIO = require('socket.io');
var MatchManager = require('./managers/MatchManager.js');

// Contains socket.io configuration
exports = module.exports = function(app, db, logger) {
    // Start socket.io
    // Inject custom logger into socket.io
    var io = socketIO.listen(app, { logger: logger });
    // Create event handlers
    io.sockets.on('connection', function (socket) {
        configureSocket(socket, io, db, logger);
        socket.emit('getMatch');
    });
};

function configureSocket(socket, io, db, logger) {
    socket.on('terminate', function () {
        // Close connection
        socket.disconnect();
    });
    socket.on('setMatch', function (matchKey) {
        // Add match info to socket
        socket.set('matchKey', matchKey, function () {});
        // Join match channel
        socket.join(matchKey);
        // Update match
        MatchManager.connectToMatch(db, matchKey, function(err, startMatch) {
            if (err) {
                logger.logException(err);
                socket.emit('error', err.message)
            }
            // If all players are connected start the match
            if (startMatch) {
                io.sockets.in(matchKey).emit('startGame');
            }
        });
    });
}