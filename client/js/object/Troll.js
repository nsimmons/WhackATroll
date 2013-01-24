
define(['object/ImageObject'], function(ImageObject) {

    function Troll(id, x, y, scene) {
        ImageObject.call(this, id, x, y, 100, scene, '/images/trollface_small.jpg');
        return this;
    }

    Troll.prototype = new ImageObject();
    Troll.prototype.constructor = Troll;

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

    return Troll;
});
