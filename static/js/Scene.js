
define(['util/QuickSort'], function(QuickSort) {

    function Scene() {
        this._sceneObjects = {};
        this._objectsToDraw = [];
    }

    // Draws the entire scene
    Scene.prototype.draw = function(ctx) {

        // Place all of the scene objects into an array
        this._objectsToDraw = [];
        for(var key in this._sceneObjects) {
            if (this._sceneObjects.hasOwnProperty(key)) {
                var object = this._sceneObjects[key];
                if (object.draw !== undefined) {
                    this._objectsToDraw.push(object);
                }
            }
        }

        // Sort the scene objects using the zBuffer property
        this._objectsToDraw = QuickSort(this._objectsToDraw, 'zBuffer');

        // Draw the objects on the scene
        for (var i = 0; i < this._objectsToDraw.length; i++) {
            this._objectsToDraw[i].draw(ctx);
        }
    };

    // Returns the object (if any) that was hit
    Scene.prototype.getObjectHit = function(x, y) {
        for (var i = 0; i < this._objectsToDraw.length; i++) {
            if (this._objectsToDraw[i].isHit(x,y)) {
                return this._objectsToDraw[i];
            }
        }
        return null;
    };

    // Add an object to the scene
    Scene.prototype.addObject = function(key, object) {
        this._sceneObjects[key] = object;
    };

    // Get an object from the scene
    Scene.prototype.getObject = function(key) {
        return this._sceneObjects[key];
    };

    // Remove an object from the scene
    Scene.prototype.removeObject = function(key) {
        delete this._sceneObjects[key];
    };

    return Scene;
});

