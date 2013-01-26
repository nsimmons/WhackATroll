"use strict";

var redis = require('redis');

// Abstracts DB implementation from server code
// Clear separation between domain objects and how they are persisted
// Should allow for DB to be easily replaced
exports = module.exports = function(port, host, config) {
    // No need to wait for the connection to be open
    // Commands will be queued until the connection is open
    var client = redis.createClient(port, host, config);

    client.on('error', function (err) {
        console.log("Redis error " + err);
    });
    client.on('connect', function () {
        console.log("Redis connected");
    });


    this.setFields = function(key, kvp, callback) {
        client.hmset(key, kvp, callback);
    }

    this.getFields = function(key, fields, callback) {
        client.hgetall(key, function (err, obj) {
            if (err) {
                return callback(err);
            }
            // If nothing found or no fields specified return obj
            if (obj === null || fields === null) {
                return callback(null, obj);
            }
            // Build new result object that only contains requested fields
            var result = {};
            for(var i = 0; i < fields.length; i++) {
                result[fields[i]] = obj[fields[i]];
            }
            return callback(null, result);
        });
    }
};

