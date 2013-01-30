require(['jquery', 'socket.io', 'login', 'register', 'ImageLoader', 'Scene', 'object/Troll', 'object/WhackHit', 'object/WhackMiss', 'util/GuidGenerator', 'lib/async'],
    function($, io, login, register, ImageLoader, Scene, Troll, WhackHit, WhackMiss, GuidGenerator, async) {

    var fps = 30;
	var imageLoader = new ImageLoader();
    var scene = null;
    var ganeLoopIntervalId = null;

    var jqCanvas = null;
    var infoText = null;
    var canvasWidth = null;
    var canvasHeight = null;

	// Wait for the page to be ready
	$(document).ready( function() {
        // Set DOM variables
        jqCanvas = $('#screen');
        infoText = $('#info_text');
        // Get canvas dimensions
        canvasWidth = jqCanvas.attr('width');
        canvasHeight = jqCanvas.attr('height');
        // Setup login and register page logic
        login();
        register();
        $('#content').on('start', function(event, player) {
            // Initialize game
            init(player);
        });
	});

    function init(playerName) {
        // Create the scene
        scene = new Scene();
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
        function(){
            // Start game
            joinMatch(playerName);
        });
    }

    function joinMatch(playerName) {
        // join a match
        $.ajax({
            type: "POST",
            url: '/match/join',
            data: {
                player: playerName
            },
            success: function(data) {
                if (!data.success) {
                    infoText.html('Error joining match.');
                } else {
                    infoText.html('Waiting for all players to join match.');
                    // Create web socket connection for match play
                    var socket = io.connect('http://localhost');
                    configureSocket(socket, playerName, data.match);
                }
            },
            error: function() {
                infoText.html('Error joining match.');
            },
            dataType: "json"
        });
    }

    // Configure socket events
    function configureSocket(socket, playerName, matchKey) {
        // Error handler
        socket.on('error', function (message) {
            infoText.html('Error connecting to match.');
            throw new Error(message);
        });
        // Send the match key when the server asks for it
        socket.on('getMatch', function () {
            socket.emit('setMatch', matchKey);
        });
        // Event handler fired when all players have connected to the match
        socket.on('startGame', function () {
            infoText.html('Match is starting!');
            startGame();
        });
        // Event handler for server telling client to place a troll.
        // Event contains first player that clicked previous troll.
        socket.on('placeTroll', function(data) {
            // Update result of last troll whack
            if (data.player !== null) {
                // Remove previous troll
                var previousTroll = scene.getObject(data.nextId - 1);
                scene.removeObject(data.nextId - 1);
                // Draw either WhackHit or WhackMiss depending on if player hit troll first
                var id = GuidGenerator();
                if (data.player === playerName) {
                    var whackHit = new WhackHit(id, previousTroll.position.x, previousTroll.position.y, scene);
                    scene.addObject(id, whackHit);
                } else {
                    var whackMiss = new WhackMiss(id, previousTroll.position.x, previousTroll.position.y, scene);
                    scene.addObject(id, whackMiss);
                }
            }
            // Place a troll in the scene randomly
            var troll = new Troll(data.nextId, 0, 0, scene);
            troll.replace(canvasWidth, canvasHeight);
            // Add troll to scene
            scene.addObject(data.nextId, troll);
            // Set click event handler on canvas
            // Curry onCanvasClicked so that e is only param left (to be passed in by event)
            var curriedHandler = onCanvasClicked.bind(undefined, socket, playerName, data.nextId);
            jqCanvas.click(curriedHandler);
        });
    }

    function startGame() {
        // Start the game loop
        ganeLoopIntervalId = setInterval(function() {
            try {
                update();
                draw();
            } catch(e) {
                // If an error occurs stop game loop and report it
                infoText.html('Error occurred: ' + e.message);
                clearInterval(ganeLoopIntervalId);
            }
        }, 1000/fps);
    }

    function update() {
        // Update scene
        scene.update();
    }

    function draw() {
        // Get canvas dimensions
        var canvasWidth = jqCanvas.attr('width');
        var canvasHeight = jqCanvas.attr('height');
        // Clear the canvas
        var ctx = jqCanvas[0].getContext('2d');
		ctx.clearRect(0, 0, canvasWidth, canvasHeight);
        // Redraw the scene
        scene.draw(ctx);
    }

	function onCanvasClicked(socket, playerName, trollId, e) {
		// Get click location relative to canvas
        var canvasOffset = $("#screen").offset();
        var x = Math.floor((e.pageX-canvasOffset.left));
		var y = Math.floor((e.pageY-canvasOffset.top));
        // If troll was not hit, ignore
        var objectHit = scene.getObjectHit(x, y);
        if (!(objectHit instanceof Troll)) {
            // Ignore if the object was not a troll
            return;
        }
        // Send hit event to server
        socket.emit('trollHit', { trollId: trollId, player: playerName });
	}
});
