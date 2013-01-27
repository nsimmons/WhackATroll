"use strict";

var util = require('util');

// code taken from http://en.wikipedia.org/wiki/ANSI_escape_code#Windows_and_DOS
var ANSICode = {
    reset: '\u001b[0m',             // all attributes off
    bright: '\u001b[1m',
    faint: '\u001b[2m',             // not widely supported
    italic: '\u001b[3m',            // not widely supported. Sometimes treated as inverse.
    underline: '\u001b[4m',
    crossedout: '\u001b[9m',        // Characters legible, but marked for deletion. Not widely supported.
    primaryfont: '\u001b[10m',
    normalcolor: '\u001b[22m',      // neither bright, bold nor faint
    underlinenone: '\u001b[24m',    // not singly or doubly underlined

    // text colors
    black: '\u001b[30m',
    red: '\u001b[31m',
    green: '\u001b[32m',
    yellow: '\u001b[33m',
    blue: '\u001b[34m',
    magenta: '\u001b[35m',
    cyan: '\u001b[36m',
    white: '\u001b[37m',
    grey: '\u001b[90m',
    defaulttext: '\u001b[39m',

    // background color
    bgblack: '\u001b[40m',
    bgred: '\u001b[41m',
    bggreen: '\u001b[42m',
    bgyellow: '\u001b[43m',
    bgblue: '\u001b[44m',
    bgmagenta: '\u001b[45m',
    bgcyan: '\u001b[46m',
    bgwhite: '\u001b[47m'
};

var logLevel = {
    debug: 4,
    info: 3,
    warn: 2,
    error: 1
};

var ttyColor = {
    white: function(text) {
        return ANSICode.bright + ANSICode.white + text + ANSICode.defaulttext;
    },
    red: function(text) {
        return ANSICode.bright + ANSICode.red + text + ANSICode.defaulttext;
    },
    yellow: function(text) {
        return ANSICode.bright + ANSICode.yellow + text + ANSICode.defaulttext;
    },
    blue: function(text) {
        return ANSICode.bright + ANSICode.blue + text + ANSICode.defaulttext;
    }
};

function setLogLevel(currentLevel, newLevel) {
    switch (newLevel) {
        case 'debug':
            currentLevel = logLevel.debug;
            break;
        case 'info':
            currentLevel = logLevel.info;
            break;
        case 'warn':
            currentLevel = logLevel.warn;
            break;
        case 'error':
            currentLevel = logLevel.error;
            break;
    }
}

function Logger(level) {
    this.timers = {};
    this.logLevel = logLevel.info;
    this.timerLevel = logLevel.info;

    this.setLogLevel(level);
    this.setTimerLogLevel(level);
}
exports = module.exports = Logger;


// Sets the level of detail to log
Logger.prototype.setLogLevel = function(level) {
    setLogLevel(this.logLevel, level);
};
Logger.prototype.setTimerLogLevel = function(level) {
    setLogLevel(this.timerLevel, level);
};

// Start a timer
Logger.prototype.timeStart = function(label) {
    this.timers[label] = Date.now();
};

// Stop timer and return the elapsed time
Logger.prototype.timeEnd = function(label) {
    var duration = Date.now() - this.timers[label];
    log(logLevel.debug, util.format('%s: %dms', label, duration));
};

Logger.prototype.debug = function(message) {
    // Only log this message if the log level permits it
    if (this.logLevel >= logLevel.debug) {
        // If the message is not a string, convert it to one
        if (typeof message !== 'string') {
            message = util.inspect(message);
        }
        console.log(ttyColor.white("[DEBUG] " + message));
    }
};
Logger.prototype.info = function(message) {
    // Only log this message if the log level permits it
    if (this.logLevel >= logLevel.info) {
        // If the message is not a string, convert it to one
        if (typeof message !== 'string') {
            message = util.inspect(message);
        }
        console.log(ttyColor.blue("[INFO] " + message));
    }
};
Logger.prototype.warn = function(message) {
    // Only log this message if the log level permits it
    if (this.logLevel >= logLevel.warn) {
        // If the message is not a string, convert it to one
        if (typeof message !== 'string') {
            message = util.inspect(message);
        }
        console.warn(ttyColor.yellow("[WARN] " + message));
    }
};
Logger.prototype.error = function(message) {
    // Only log this message if the log level permits it
    if (this.logLevel >= logLevel.error) {
        // If the message is not a string, convert it to one
        if (typeof message !== 'string') {
            message = util.inspect(message);
        }
        console.error(ttyColor.red("[ERROR] " + message));
    }
};

Logger.prototype.logException = function(error, cause) {
    // Only log this message if the log level permits it
    if (this.logLevel >= logLevel.error) {
        if (!cause) {
            console.error(ttyColor.red("[ERROR] " + error.stack));
        } else {
            console.error(ttyColor.red("Cause - " + error.stack));
        }
        // Recursively log the inner exceptions
        if (error.cause) {
            this.logException(error.cause, true);
        }
    }
};
