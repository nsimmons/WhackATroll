"use strict";

var Player = require('../models/Player.js');

// Registration controller
exports = module.exports = function(app) {
    app.get('/register', register);
    app.post('/register', register);
};

function register(req, res) {
    // check if player exists
    var player = new Player(req.query.player);
    player.exists(req.db, function(err, result) {
        if (err) {
            // Server error (HTTP 500)
            req.logger.logException(err);
            return res.send(500, { error: err.message });
        }

        // player already exists!
        if (result) {
            return res.send(200, { exists: true });
        }

        // create player and save to DB
        player.name = req.query.player;
        player.password = req.query.password;
        player.save(req.db, function(err, result) {
            if (err) {
                // Server error (HTTP 500)
                req.logger.logException(err);
                return res.send(500, { error: err.message });
            }
            return res.send(200, result);
        });
    });
}