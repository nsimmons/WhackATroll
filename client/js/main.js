require(['jquery', 'ImageLoader', 'Scene', 'object/Troll', 'object/WhackHit', 'util/GuidGenerator', 'lib/async'],
    function($, ImageLoader, Scene, Troll, WhackHit, GuidGenerator, async) {

    var fps = 30;
	var imageLoader = new ImageLoader();
    var scene = null;
    var trollKey = 'troll';

	// Wait for the page to be ready
	$(document).ready( function() {
        // Initialize game
        init();
	});

    function init() {
        // Preload resources
        async.parallel([
            function(callback){
                imageLoader.loadImage('/images/trollface_small.jpg', function() {
                    callback(null, '/images/trollface_small.jpg');
                });
            },
            function(callback){
                imageLoader.loadImage('/images/green_check.jpg', function() {
                    callback(null, '/images/green_check.jpg');
                });
            },
            function(callback){
                imageLoader.loadImage('/images/red_x.jpg', function() {
                    callback(null, '/images/red_x.jpg');
                });
            }
        ],
        function(err, results){
            // Start game
            startGame();
        });
    }

    function startGame() {
        // Create the scene
        scene = new Scene();

        // Set click event handler on canvas
        $('#screen').click(onCanvasClicked);

        // Place a troll in the scene
        var troll = new Troll(trollKey, 0,0, scene);
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
        // Update scene
        scene.update();
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

        // place a WhackHit object on the troll's position
        var troll = scene.getObject(trollKey);
        var id = GuidGenerator();
        var whackHit = new WhackHit(id, troll.position.x, troll.position.y, scene);
        scene.addObject(id, whackHit);

        // replace the troll
        replaceTroll();
	}
});