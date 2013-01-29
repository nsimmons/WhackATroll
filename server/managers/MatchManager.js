"use strict";

var util = require('util');
var Match = require('../models/Match.js');

var matchQueueKey = 'matches';
var matchIdCounter = 'counter:matchId';

// Initializes the match manager
exports.init = function(db) {
    // Create the match ID counter
    db.setValue(matchIdCounter, "0");
};

// Gets an available match to join, if one is available
exports.getAvailableMatch = function(db, callback) {
    // Try to fetch an available match from the queue
    db.removeFromQueue(matchQueueKey, function(err, matchId) {
        if (err) {
            var error = new Error("Error fetching match from 'available' queue");
            error.cause = err;
            return callback(error);
        }
        if (matchId === null) {
            //return null if no match was found
            return callback(null, null);
        }
        // Load the match from the DB
        var match = new Match(matchId);
        return match.load(db, function(err) {
            if (err) {
                return callback(err);
            }
            // Return the match now that it has been loaded
            return callback(null, match);
        });
    });
};

// Creates a new match and assigns the player to it
exports.createMatch = function (db, callback) {
    // Fetch next match ID
    db.incrementCounter(matchIdCounter, function(err, matchId) {
        if (err) {
            return callback(err);
        }
        // Create new match and return it
        return callback(null, new Match(matchId));
    });
};

// Adds a match to the available queue
exports.addAvailableMatch = function(db, match, callback) {
    db.addToQueue(matchQueueKey, match.key, callback);
};

// Connects a player to the match and returns if match is ready to start
exports.connectToMatch =  function(db, matchKey, callback) {
    db.incrementCounter('connectedCount:' + matchKey, function(err, connectedCount) {
        if (err) {
            return callback(err);
        }
        // Return true if all players have connected
        return callback(null, connectedCount >= 2);
    });
};