
define(['Vector2', 'ImageLoader'], function(Vector2, ImageLoader) {

    function ImageObject(id, x, y, zBuffer, scene, imgId) {
        this.id = id;
        this.scene = scene;
        this.position = new Vector2(x, y);
        this.zBuffer = zBuffer;
        this.image = null;

        if (imgId !== undefined) {
            // Get image (should already be cached)
            var imageLoader = new ImageLoader();
            this.image = imageLoader.loadImage(imgId);
            if (this.image === null) {
                throw new Error("Object image has not been loaded");
            }
        }
        return this;
    }

    ImageObject.prototype.update = function() {
    };

    ImageObject.prototype.draw = function(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
    };

    ImageObject.prototype.isHit = function(x, y) {
        return (x >= this.position.x &&
            x <= this.position.x + this.image.width &&
            y >= this.position.y &&
            y <= this.position.y + this.image.height);
    };

    return ImageObject;
});

