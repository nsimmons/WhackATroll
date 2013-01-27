"use strict";

var util = require('util');
var GameObject = require('./GameObject.js');
var NotFoundError = require('../errors/NotFoundError.js');

// Represents a player
function Player(key) {
    GameObject.call(this, 'player', key);
    this.name = null;
    this.password = null;
    this.wins = 0;
}

util.inherits(Player, GameObject);
exports = module.exports = Player;

// Determines if a specified player exists in the DB
Player.prototype.exists = function(db, callback) {
    var self = this;
    db.exists(this, function(err, result) {
        if (err) {
            var error = new Error("Failed to check existence of player " + self.key);
            error.cause = err;
            return callback(error);
        }
        return callback(null, result !== 0);
    });
};

// Loads a player from the DB
Player.prototype.load = function (db, callback) {
    var self = this;
    db.loadObject(this, null, function (err, result) {
        if (err) {
            var error = new Error("Failed to load player " + self.key);
            error.cause = err;
            return callback(error);
        }
        // throw an error if the player was not found
        if (result === false) {
            return callback(new NotFoundError(null, self.key));
        }
        return callback(null);
    });
};

// Save player in DB
Player.prototype.save = function (db, callback) {
    var self = this;
    db.saveObject(this, null, function (err, result) {
        if (err) {
            var error = new Error("Failed to save player " + self.key);
            error.cause = err;
            return callback(error);
        }
        return callback(null, result !== 0);
    });
};