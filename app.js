"use strict";

var express = require('express');
var routes = require('./server/controllers/routes.js');
var config = require('./server/config.js');

// Create HTTP server
var app = express();
// Configure server
config(app);
// Setup controller routes
routes(app);
