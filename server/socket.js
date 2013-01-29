"use strict";

var socketIO = require('socket.io');

// Contains socket.io configuration
exports = module.exports = function(app, logger) {
    // Start socket.io
    // Inject custom logger into socket.io
    var io = socketIO.listen(app, { logger: logger });
    // Create event handlers
    io.sockets.on('connection', function (socket) {
        socket.emit('startGame');
        socket.on('terminate', function () {
            // Close connection
            socket.disconnect();
        });
    });
};