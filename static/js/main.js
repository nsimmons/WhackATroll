require(['jquery', 'ImageLoader', 'Scene', 'object/Troll'], function($, ImageLoader, Scene, Troll) {

    var fps = 30;
	var imageLoader = new ImageLoader();
    var scene = null;
    var trollKey = 'troll';

	// Wait for the page to be ready
	$(document).ready( function() {
		// Preload resources
		imageLoader.loadImage('/images/trollface_small.jpg', startGame);
	});

    function startGame() {
        // Create the scene
        scene = new Scene();

        // Set click event handler on canvas
        $('#screen').click(onCanvasClicked);

        // Place a troll in the scene
        var troll = new Troll(0,0);
        scene.addObject(trollKey, troll);

        // Replace it randomly
        replaceTroll();

        // Start the game loop
        setInterval(function() {
            update();
            draw();
        }, 1000/fps);
    }

    function update() {
    }

    function draw() {
        // Get canvas dimensions
        var jqCanvas = $('#screen');
        var canvasWidth = jqCanvas.attr('width');
        var canvasHeight = jqCanvas.attr('height');

        // Clear the canvas
        var ctx = jqCanvas[0].getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);

        // Redraw the scene
        scene.draw(ctx);
    }

    // Places troll randomly on canvas
    function replaceTroll() {
        // Get canvas dimensions
        var jqCanvas = $('#screen');
        var canvasWidth = jqCanvas.attr('width');
        var canvasHeight = jqCanvas.attr('height');

        // Place it randomly in the scene
        var troll = scene.getObject(trollKey);
        troll.replace(canvasWidth, canvasHeight);
    }

	function onCanvasClicked(e) {
		// Get click location relative to canvas
        var canvasOffset = $("#screen").offset();
        var x = Math.floor((e.pageX-canvasOffset.left));
		var y = Math.floor((e.pageY-canvasOffset.top));

        // if troll was not hit, ignore
        var objectHit = scene.getObjectHit(x, y);
        if (objectHit !== scene.getObject(trollKey)) {
            return;
        }

        // replace the troll
        replaceTroll();
	}
	
//	function drawSuccess(location) {
//		var ctx = $('#screen')[0].getContext('2d');
//		ctx.fillStyle = "green";
//		ctx.fillRect(location.xMin,
//            location.yMin,
//            location.xMax - location.xMin,
//            location.yMax - location.yMin);
//
//	}
//

});
