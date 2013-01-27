"use strict";

var util = require('util');
var redis = require('redis');
var GameObject = require('../models/GameObject.js');

// Abstracts DB implementation from server code
// Clear separation between domain objects and how they are persisted
// Should allow for DB to be easily replaced
exports = module.exports = function(port, host, config, logger) {
    // No need to wait for the connection to be open
    // Commands will be queued until the connection is open
    var client = redis.createClient(port, host, config);

    // Handle DB events
    client.on('error', function (err) {
        logger.error("Redis error " + err);
    });
    client.on('connect', function () {
        logger.info("Redis connected");
    });

    // Determines if a specified object exists in the DB
    this.exists = function(gameObject, callback) {
        // Check type
        if (!(gameObject instanceof GameObject)) {
            return callback(new Error('Cannot save an object that is not an instance of GameObject'));
        }
        var dbKeyName = createDbKey(gameObject.getType(), gameObject.getKey());
        return client.exists(dbKeyName, callback);
    };

    // Persists field(s) for object identified by key
    // 'fields' parameter is an object of field names to save, or null to return all
    this.saveObject = function(gameObject, fields, callback) {
        // Check type
        if (!(gameObject instanceof GameObject)) {
            return callback(new Error('Cannot save an object that is not an instance of GameObject'));
        }
        var dbKeyName = createDbKey(gameObject.getType(), gameObject.getKey());
        var objectToSave = convertToRedisFields(gameObject, fields, dbKeyName);
        return client.hmset(dbKeyName, objectToSave, callback);
    };

    // Loads an object from the DB
    // 'fields' parameter is an object of field names to return, or null to return all
    this.loadObject = function (gameObject, fields, callback) {
        // Check type
        if (!(gameObject instanceof GameObject)) {
            return callback(new Error('Cannot save an object that is not an instance of GameObject'));
        }
        var dbKeyName = createDbKey(gameObject.getType(), gameObject.getKey());
        // hgetall() will return value as JSON object, with hash fields as properties
        return client.hgetall(dbKeyName, function (err, obj) {
            if (err) {
                return callback(err);
            }
            // If object was not found return false
            if (obj === null) {
                return callback(null, false);
            }
            // Build new result object that only contains requested fields
            convertFromRedisFields(gameObject, obj, fields);
            return callback(null, true);
        });
    };
};

// Construct db key
function createDbKey(type, key) {
    return type + ":" + key;
}

// Converts an object to save into Redis compatible (string) hash fields
function convertToRedisFields(gameObject, fieldsToSave, dbKeyName) {
    var objectToSave = {};
    // Iterate through all fields
    for (var fieldName in gameObject) {
        // Only store fields that are not part of the object's prototype hierarchy
        // and are in the list of fields to save
        if (gameObject.hasOwnProperty(fieldName)
            && (fieldsToSave === null || fieldsToSave.hasOwnProperty(fieldName))) {
            var fieldType = typeof gameObject[fieldName];
            if (fieldType === 'function') {
                // ignore functions
            } else if (fieldType === 'string') {
                // keep strings as they are
                objectToSave[fieldName] = gameObject[fieldName];
            } else if (fieldType === 'number' || fieldType === 'boolean') {
                // convert to string
                objectToSave[fieldName] = '?' + fieldType + '?' + gameObject[fieldName];
            } else if (fieldType === 'object') {
                if (gameObject[fieldName] === null) {
                    // store an identifier to mark nulls
                    objectToSave[fieldName] = '?null?';
                } else if (util.isDate(gameObject[fieldName])) {
                    // Date is stored in epoch time
                    objectToSave[fieldName] = '?date?' + gameObject[fieldName].getTime();
                } else if (util.isArray(gameObject[fieldName])) {
                    // Arrays need to be stored under a separate key
                    objectToSave[fieldName] = '?array?' + createDbKey(dbKeyName, fieldName);
                    // TODO: logic for storing array
                } else if (objectToSave[fieldName] instanceof GameObject) {
                    // Game objects are stored as a reference only
                    objectToSave[fieldName] = '?ref?' + createDbKey(gameObject[fieldName].getType(), gameObject[fieldName].getKey());
                } else {
                    //Ignore everything else for now
                }
            }
        }
    }
    return objectToSave;
}

// Converts a Redis results back to their proper game object fields
function convertFromRedisFields(gameObject, dbResult, fieldsToLoad) {
    // If no fields specified load everything
    var loadAll = (fieldsToLoad === null || fieldsToLoad.length === 0);
    for(var fieldName in gameObject) {
        // Only load fields that are not part of the object's prototype hierarchy
        // and are in the list of fields to load
        if (gameObject.hasOwnProperty(fieldName)
            && dbResult.hasOwnProperty(fieldName)
            && (loadAll || fieldsToLoad.hasOwnProperty(fieldName))) {

            // Check if any conversions are necessary
            var fieldValue = dbResult[fieldName];
            if (dbResult[fieldName].match('^\\?number\\?.*')) {
                fieldValue = parseFloat(dbResult[fieldName].substring(8));
            } else if (dbResult[fieldName].match('^\\?boolean\\?.*')) {
                fieldValue = dbResult[fieldName].substring(9) === "true";
            } else if (dbResult[fieldName].match('^\\?null\\?.*')) {
                fieldValue = null;
            } else if (dbResult[fieldName].match('^\\?date\\?.*')) {
                fieldValue = new Date(dbResult[fieldName].substring(6));
            } else if (dbResult[fieldName].match('^\\?array\\?.*')) {
                fieldValue = dbResult[fieldName].substring(7);
                // TODO: separate query to load array
            } else if (dbResult[fieldName].match('^\\?ref\\?.*')) {
                fieldValue = dbResult[fieldName].substring(5);
                // TODO: separate query to load object
            }
            // Set converted value
            gameObject[fieldName] = fieldValue;
        }
    }
}

