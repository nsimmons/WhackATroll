var util = require('util');

// All game objects inherit from this
// Stores the fields common across all game objects
function GameObject(type, key) {
    this.type = type;
    this.key = key;
}

GameObject.prototype.getType = function() {
    return this.type;
};
GameObject.prototype.getKey = function() {
    return this.key;
};

exports = module.exports = GameObject;
