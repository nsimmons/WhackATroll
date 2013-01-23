
define(['Vector2', 'ImageLoader'], function(Vector2, ImageLoader) {

    function WhackMiss(id, x, y, scene) {
        this.id = id;
        this.scene = scene;
        this.position = new Vector2(x, y);
        this.zBuffer = 99;
        this.image = null;

        // Get image
        // It's expected that the image has been cached
        var imageLoader = new ImageLoader();
        this.image = imageLoader.loadImage('/images/red_x.jpg');
        if (this.image === null) {
            throw { message: "WhackMiss image has not been loaded" };
        }

        var now = new Date();
        // TODO: Time interval should be moved into a config file
        this.removeTimer = now.getTime() + 1000;

        return this;
    }

    WhackMiss.prototype.update = function() {
        // Remove if the timer has elapsed
        var now = new Date();
        if (now.getTime() > this.removeTimer) {
            this.scene.removeObject(this.id);
        }
    };

    WhackMiss.prototype.draw = function(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
    };

    WhackMiss.prototype.isHit = function (x, y) {
        return (x >= this.position.x &&
            x <= this.position.x + this.image.width &&
            y >= this.position.y &&
            y <= this.position.y + this.image.height);
    };

    return WhackMiss;
});
