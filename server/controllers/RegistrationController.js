"use strict";

// Registration controller
exports = module.exports = function(app) {
    app.get('/register', register);
    app.post('/register', register);
};

function register(req, res) {
    res.send({ message: "register!" });
}