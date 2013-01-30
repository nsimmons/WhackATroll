"use strict";

var util = require('util');
var GameObject = require('./GameObject.js');
var NotFoundError = require('../errors/NotFoundError.js');

// Represents a match
function Match(key) {
    GameObject.call(this, 'match', key);
    this.playerScore = {};
    this.currentTrollId = 0;
}

util.inherits(Match, GameObject);
exports = module.exports = Match;

// Add player to match
Match.prototype.addPlayer = function(playerKey) {
    // Set player score
    this.playerScore[playerKey] = 0;
};

// Get next troll ID
Match.prototype.getNextTrollId = function() {
    // Increment currentTrollId and return
    return ++this.currentTrollId;
};

// Updates match score if needed. Returns true if player score was changed
Match.prototype.updateScore = function(playerKey, trollId) {
    if (trollId !== this.currentTrollId) {
        // Doesn't match, do not update player score
        return false
    }
    this.playerScore[playerKey]++;
    return true;
};

// Loads a match from the DB
Match.prototype.load = function (db, callback) {
    var self = this;
    db.loadObject(this, null, function (err, result) {
        if (err) {
            var error = new Error("Failed to load match " + self.key);
            error.cause = err;
            return callback(error);
        }
        // throw an error if the match was not found
        if (result === false) {
            return callback(new NotFoundError(null, self.key));
        }
        return callback(null);
    });
};

// Save match in DB
Match.prototype.save = function (db, callback, fieldsToSave) {
    // Make sure fieldsToSave is null if not set
    if (fieldsToSave === undefined) {
        fieldsToSave = null;
    }
    var self = this;
    db.saveObject(this, null, function (err, result) {
        if (err) {
            var error = new Error("Failed to save match " + self.key);
            error.cause = err;
            return callback(error);
        }
        return callback(null, result !== 0);
    });
};
