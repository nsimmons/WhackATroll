"use strict";

// Login controller
exports = module.exports = function(app) {
    app.get('/login', login);
    app.post('/login', login);
};

function login(req, res) {
    req.db.getFields(req.query.player, ['password'], function(err, player) {
        res.send({ message: "login!", player: player });
    });
}