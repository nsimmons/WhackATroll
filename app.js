"use strict";

var fs = require('fs');
var express = require('express');
var routes = require('./server/controllers/routes.js');
var config = require('./server/config.js');
var DB = require('./server/database/db.js');

// Create DB connection
var dbOptions = {};
var db = new DB(6379, 'ec2-50-19-135-45.compute-1.amazonaws.com', dbOptions);

// Create HTTP server
var app = express();
config(app, db);
routes(app);

// Cache main HTML page that will be served as directory root
var rootHtml = fs.readFileSync('client/main.html');
app.get('/', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.send(rootHtml);
});

var port = 8080;
console.log('app listening on port ' + port);
app.listen(port);