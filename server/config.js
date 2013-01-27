"use strict";

var express = require('express');
var DB = require('./database/db.js');
var Logger = require('./utils/Logger.js');

// Create logger
var logger = new Logger('info');

// Create DB connection
var dbOptions = {};
var db = new DB(6379, 'ec2-50-19-135-45.compute-1.amazonaws.com', dbOptions, logger);

// Contains app config
// Used during app startup
exports = module.exports = function(app) {
    // Inject dependencies into request
    app.use(function(req, res, next){
        req.db = db;
        req.logger = logger;
        next();
    });
    // Allows client files to be served by node
    app.use(express.static(__dirname + '/../client'));
    // Compress responses
    app.use(express.compress());
    // Auto parse HTTP body
    app.use(express.bodyParser());
    // Route request to controllers
    app.use(app.router);

    var port = 8080;
    app.listen(port);
    logger.info('app listening on port ' + port);
};
