"use strict";
var fs = require('fs');

// Import modules
var express = require('express');

var rootHtml = fs.readFileSync('client/main.html');

// Create HTTP server
var app = express();

// Allows client files to be served by node
app.use(express.static(__dirname + '/client'));

app.get('/', function(req, res) {
    res.set('Content-Type', 'text/html');
    res.send(rootHtml);
});

app.listen(8080);