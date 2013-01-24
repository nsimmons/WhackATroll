"use strict";

// Login controller
exports = module.exports = function(app) {
    app.get('/login', login);
    app.post('/login', login);
};

function login(req, res) {
    res.send({ message: "login!" });
}