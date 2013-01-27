"use strict";

var MatchManager = require('../managers/MatchManager.js');

// Match controller
exports = module.exports = function(app) {
    app.get('/match/join', join);
    app.post('/match/join', function(req, res) {
        // Convert body params to query params
        req.query.player = req.body.player;
        join(req, res);
    });
};

// Attempts to join a player to a match
function join(req, res) {
    req.logger.info('/match/join called');
    // See if there is a match to join
    MatchManager.getAvailableMatch(req.db, function(err, match) {
        if (err) {
            // Server error (HTTP 500)
            req.logger.logException(err);
            return res.send(500, { error: err.message });
        }

        if (match) {
            // Match found, add player to it
            return updateAndReturnMatch(req, res, match, false);
        } else {
            // Match not found, create one
            return MatchManager.createMatch(req.db, function(err, newMatch) {
                if (err) {
                    // Server error (HTTP 500)
                    req.logger.logException(err);
                    return res.send(500, { error: err.message });
                }
                // Add player and return it
                return updateAndReturnMatch(req, res, newMatch, true);
            });
        }
    });
}

// Updates a match found for a player and returns it's ID
function updateAndReturnMatch(req, res, match, isNew) {
    match.addPlayer(req.query.player);
    // Save match with player added
    match.save(req.db, function(err) {
        if (err) {
            // Server error (HTTP 500)
            req.logger.logException(err);
            return res.send(500, { error: err.message });
        }

        if (isNew) {
            // Add match to available queue
            return MatchManager.addAvailableMatch(req.db, match, function(err) {
                if (err) {
                    // Server error (HTTP 500)
                    req.logger.logException(err);
                    return res.send(500, { error: err.message });
                }
                // Return match key
                return res.send(200, { success: true, match: match.key });
            });
        } else {
            // Return match key
            return res.send(200, { success: true, match: match.key });
        }
    });
}
