"use strict";

var LoginController = require('./LoginController.js');
var RegistrationController = require('./RegistrationController.js');
var MatchController = require('./MatchController.js');

// Connects all controller routes
// Used during app startup
exports = module.exports = function(app) {
    LoginController(app);
    RegistrationController(app);
    MatchController(app);
};
