"use strict";

// Import modules
var express = require('express');

// Create HTTP server
var app = express();

// Allows static files to be returned
app.use(express.static(__dirname + '/static'));

app.listen(8080);