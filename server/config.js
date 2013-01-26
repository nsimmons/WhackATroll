"use strict";

var express = require('express');

// Contains app config
// Used during app startup
exports = module.exports = function(app, db) {
    // Allows client files to be served by node
    app.use(express.static(__dirname + '/../client'));
    // Compress responses
    app.use(express.compress());
    // Auto parse HTTP body
    app.use(express.bodyParser());
    // Add DB connection to request
    app.use(function(req, res, next){
        req.db = db;
        next();
    });
};
