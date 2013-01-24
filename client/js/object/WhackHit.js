
define(['object/ImageObject'], function(ImageObject) {

    function WhackHit(id, x, y, scene) {
        ImageObject.call(this, id, x, y, 99, scene, '/images/green_check.jpg');

        var now = new Date();
        // TODO: Time interval should be moved into a config file
        this.removeTimer = now.getTime() + 1000;

        return this;
    }

    WhackHit.prototype = new ImageObject();
    WhackHit.prototype.constructor = WhackHit;

    WhackHit.prototype.update = function() {
        // Remove if the timer has elapsed
        var now = new Date();
        if (now.getTime() > this.removeTimer) {
            this.scene.removeObject(this.id);
        }
    };

    return WhackHit;
});
