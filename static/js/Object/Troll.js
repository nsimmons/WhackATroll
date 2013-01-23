
define(['Vector2', 'ImageLoader'], function(Vector2, ImageLoader) {

    function Troll(id, x, y, scene) {
        this.id = id;
        this.scene = scene;
        this.position = new Vector2(x, y);
        this.zBuffer = 100;
        this.image = null;

        // Get troll face image
        // It's expected that the image has been cached
        var imageLoader = new ImageLoader();
        this.image = imageLoader.loadImage('/images/trollface_small.jpg');
        if (this.image === null) {
            throw { message: "troll face image has not been loaded" };
        }
        return this;
    }

    Troll.prototype.update = function() {
    };

    Troll.prototype.draw = function(ctx) {
        ctx.drawImage(this.image, this.position.x, this.position.y, this.image.width, this.image.height);
    };

    Troll.prototype.replace = function(canvasWidth, canvasHeight) {
        // Need to make sure image will not be out of canvas boundary
        var maxX = canvasWidth - this.image.width;
        var x = Math.floor(Math.random() * maxX);
        var maxY = canvasHeight - this.image.height;
        var y = Math.floor(Math.random() * maxY);

        // Update position in scene
        this.position.x = x;
        this.position.y = y;
    };

    Troll.prototype.isHit = function(x, y) {
        return (x >= this.position.x &&
            x <= this.position.x + this.image.width &&
            y >= this.position.y &&
            y <= this.position.y + this.image.height);
    };

    return Troll;
});
