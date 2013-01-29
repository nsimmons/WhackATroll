require(['jquery', 'socket.io', 'login', 'register', 'ImageLoader', 'Scene', 'object/Troll', 'object/WhackHit', 'util/GuidGenerator', 'lib/async'],
    function($, io, login, register, ImageLoader, Scene, Troll, WhackHit, GuidGenerator, async) {

    var fps = 30;
	var imageLoader = new ImageLoader();
    var scene = null;
    var trollKey = 'troll';
    var ganeLoopIntervalId = null;

	// Wait for the page to be ready
	$(document).ready( function() {
        // Setup login and register page logic
        login();
        register();
        $('#content').on('start', function(event) {
            // Initialize game
            init(event.player);
        });
	});

    function init(playerName) {
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
                    $('#info_text').html('Error joining match.');
                } else {
                    $('#info_text').html('Waiting for all players to join match.');
                    // Create web socket connection for match play
                    var socket = io.connect('http://localhost');
                    configureSocket(socket, playerName, data.match);
                }
            },
            error: function(jqXHR, textStatus, errorThrown) {
                $('#info_text').html('Error joining match.');
            },
            dataType: "json"
        });
    }

    // Configure socket events
    function configureSocket(socket, playerName, matchKey) {
        // Error handler
        socket.on('error', function (message) {
            $('#info_text').html('Error connecting to match.');
            throw new Error(message);
        });
        // Send the match key when the server asks for it
        socket.on('getMatch', function () {
            socket.emit('setMatch', matchKey);
        });
        // Event handler fired when all players have connected to the match
        socket.on('startGame', function () {
            $('#info_text').html('Match is starting!');
            startGame(playerName, matchKey);
        });
    }

    function startGame(playerName, matchKey) {
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
        ganeLoopIntervalId = setInterval(function() {
            try {
                update();
                draw();
            } catch(e) {
                // If an error occurs stop game loop and report it
                $('#info_text').html('Error occurred: ' + e.message);
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
