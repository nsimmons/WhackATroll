
define(['object/ImageObject'], function(ImageObject) {

    function WhackMiss(id, x, y, scene) {
        ImageObject.call(this, id, x, y, 99, scene, '/images/red_x.jpg');

        var now = new Date();
        // TODO: Time interval should be moved into a config file
        this.removeTimer = now.getTime() + 1000;

        return this;
    }

    WhackMiss.prototype = new ImageObject();
    WhackMiss.prototype.constructor = WhackMiss;

    WhackMiss.prototype.update = function() {
        // Remove if the timer has elapsed
        var now = new Date();
        if (now.getTime() > this.removeTimer) {
            this.scene.removeObject(this.id);
        }
    };

    return WhackMiss;
});
