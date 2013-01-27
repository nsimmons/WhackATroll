"use strict";

var util = require('util');

function NotFoundError(msg, key, constr) {
    Error.captureStackTrace(this, constr || this);
    this.message = (msg || 'Object not found') + ' (key: ' + key + ')';
}
util.inherits(NotFoundError, Error);
NotFoundError.prototype.name = 'NotFoundError';

exports = module.exports = NotFoundError;
