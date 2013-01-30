"use strict";

var socketIO = require('socket.io');
var MatchManager = require('./managers/MatchManager.js');
var Match = require('./models/Match.js');

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
    // Handles client socket closing
    socket.on('terminate', function () {
        // Close connection
        socket.disconnect();
    });
    // Handles client establishing match with socket
    socket.on('setMatch', function (matchKey) {
        // Add match info to socket
        socket.set('matchKey', matchKey, function () {
            // Join match channel
            socket.join(matchKey);
            // Update match
            MatchManager.connectToMatch(db, matchKey, function(err, startMatch) {
                if (err) {
                    logger.logException(err);
                    io.sockets.in(matchKey).emit('error', err.message);
                }
                // If all players are connected start the match
                if (startMatch) {
                    io.sockets.in(matchKey).emit('startGame');
                    setTimeout(nextTroll, 5000, matchKey, null, null, io, db, logger);
                }
            });

        });
    });
    // Handles user whacking troll
    socket.on('trollHit', function (data) {
        logger.info('trollHit - player: ' + data.player + ' trollId: ' + data.trollId);
        // Get match info from socket
        socket.get('matchKey', function(err, matchKey) {
            nextTroll(matchKey, data.player, data.trollId, io, db, logger);
        });
    });
}

function nextTroll(matchKey, playerName, trollId, io, db, logger) {
    // Load the match from the DB
    var match = new Match(matchKey);
    return match.load(db, function(err) {
        if (err) {
            logger.logException(err);
            io.sockets.in(matchKey).emit('error', err.message);
        }
        // Send the next troll if player is null (first call) or player was first to click troll
        var sendNextTroll = true;
        if (playerName !== null) {
            sendNextTroll = match.updateScore(playerName, trollId);
        }
        if (sendNextTroll) {
            // Get next trollId
            var nextId = match.getNextTrollId();
            match.save(db, function(err) {
                if (err) {
                    logger.logException(err);
                    io.sockets.in(matchKey).emit('error', err.message);
                }
                // Send event to clients with new trollId
                io.sockets.in(matchKey).emit('placeTroll', { nextId: trollId, player: playerName });
            });
        }
    });
}
