"use strict";

var Player = require('../models/Player.js');

// Registration controller
exports = module.exports = function(app) {
    app.get('/register', register);
    app.post('/register', function(req, res) {
        // Convert body params to query params
        req.query.player = req.body.player;
        req.query.password = req.body.password;
        register(req, res);
    });
};

function register(req, res) {
    req.logger.info('/register called');
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
            return res.send(200, { success: false });
        }
        // create player and save to DB
        player.name = req.query.player;
        // TODO: Password needs to be hashed using SHA and a random salt
        // Salt and hash will be saved in DB
        player.password = req.query.password;
        player.save(req.db, function(err, result) {
            if (err) {
                // Server error (HTTP 500)
                req.logger.logException(err);
                return res.send(500, { error: err.message });
            }
            return res.send(200, { success: true });
        });
    });
}