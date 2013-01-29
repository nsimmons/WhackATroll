"use strict";

var fs = require('fs');
var http = require('http');
var express = require('express');
var DB = require('./database/db.js');
var Logger = require('./utils/Logger.js');
var MatchManager = require('./managers/MatchManager.js');
var socket = require('./socket.js');

// Config options
var port = 8080;
var dbPort = 6379;
var dbHost = 'ec2-50-19-135-45.compute-1.amazonaws.com';
var dbOptions = {};

// Create logger
var logger = new Logger('info');

// Create DB connection
var db = new DB(dbPort, dbHost, dbOptions, logger);

// Init match manager
MatchManager.init(db);

// Cache main HTML page that will be served as directory root
var rootHtml = fs.readFileSync('client/main.html');

// Contains app config
// Used during app startup
exports = module.exports = function(app) {
    // Inject dependencies into request
    app.use(function(req, res, next){
        req.db = db;
        req.logger = logger;
        next();
    });
    // Compress responses
    app.use(express.compress());
    // Auto parse HTTP body
    app.use(express.bodyParser());
    // Route request to controllers
    app.use(app.router);
    // Create special routes
    mapSpecialRoutes(app);
    // Allows client files to be served by node
    app.use(express.static(__dirname + '/../client'));
    // Initialize socket.io
    // Need to create server object because socket.io does not support Express 3.0 app
    var server = http.createServer(app);
    socket(server, logger);
    // Start listening for requests
    server.listen(port);
    logger.info('app listening on port ' + port);
};

// Sets up a few special case routes
function mapSpecialRoutes(app) {
    // Create root directory mapping
    app.get('/', function(req, res) {
        res.set('Content-Type', 'text/html');
        res.send(rootHtml);
    });
    // Redirect client to correct socket.io client path
    app.get('/js/socket.io.js', function(req,res) {
       res.redirect('/socket.io/socket.io.js');
    });
}

