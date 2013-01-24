"use strict";

var express = require('express');

// Contains app config
// Used during app startup
exports = module.exports = function(app) {
    // Allows client files to be served by node
    app.use(express.static(__dirname + '/../client'));
};