"use strict";

var Player = require('../models/Player.js');

// Login controller
exports = module.exports = function(app) {
    app.get('/login', login);
    app.post('/login', login);
};

function login(req, res) {
    // load player
    var player = new Player(req.query.player);
    player.load(req.db, function(err) {
        if (err) {
            // Return 404 if the player was not found
            if (err.name == 'NotFoundError') {
                return res.send(404);
            } else {
                // Otherwise server error (HTTP 500)
                req.logger.logException(err);
                return res.send(500, { error: err.message });
            }
        }

        var responseCode = (req.query.password === player.password) ? 200 : 403;
        return res.send(responseCode);
    });
}