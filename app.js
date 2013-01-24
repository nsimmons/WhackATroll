"use strict";

var fs = require('fs');
var express = require('express');
var routes = require('./server/controllers/routes.js');
var config = require('./server/config.js');

// Create HTTP server
var app = express();
config(app);
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