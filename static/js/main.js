require(['jquery', 'ImageLoader'], function($, ImageLoader) {

	var trollFacePath = '/images/trollface_small.jpg';
	var imageLoader = new ImageLoader();
	
	// Coordinates of troll image
	var trollLocation = {
		xMin : -1,
		xMax : -1,
		yMin : -1,
		yMax : -1
	};
	
	// Wait for the page to be ready
	$(document).ready( function() {
		// Set click event handler on canvas
		$('#screen').click(onCanvasClicked);
		
		// Preload troll image
		imageLoader.loadImage(trollFacePath, startGame);
	});
	
	function onCanvasClicked(e) {
		// Get click location relative to canvas
        var canvasOffset = $("#screen").offset();
        var x = Math.floor((e.pageX-canvasOffset.left));
		var y = Math.floor((e.pageY-canvasOffset.top));
		
		// if troll was clicked, clear it and re-place
		if (trollHit(x,y)) {
			clearTroll();
			drawSuccess();
			placeTroll();
		}
	}
	
	function drawSuccess() {
		var ctx = $('#screen')[0].getContext('2d');
		ctx.fillStyle = "green";
		ctx.fillRect(trollLocation.xMin,
					 trollLocation.yMin,
					 trollLocation.xMax - trollLocation.xMin,
					 trollLocation.yMax - trollLocation.yMin);
		
	}
	
	// Returns true if troll face was clicked
	function trollHit(x, y) {
		return (x >= trollLocation.xMin &&
				x <= trollLocation.xMax &&
				y >= trollLocation.yMin &&
				y <= trollLocation.yMax);
	}
	
	// Clears current troll face from canvas
	function clearTroll() {
		var ctx = $('#screen')[0].getContext('2d');
		ctx.clearRect(trollLocation.xMin, trollLocation.yMin, trollLocation.xMax, trollLocation.yMax);
	}
	
	function startGame() {
		placeTroll();
	}
	
	// Places troll randomly on canvas
	function placeTroll() {
		// Get troll face image
		imageLoader.loadImage(trollFacePath, function(imgTroll) {
		
			// Get canvas dimensions
			var jqCanvas = $('#screen');
			var canvasWidth = jqCanvas.attr('width');
			var canvasHeight = jqCanvas.attr('height');
			
			// Need to make sure image will not be out of canvas boundary
			var maxX = canvasWidth - imgTroll.width;
			var x = Math.floor(Math.random() * maxX);
			var maxY = canvasHeight - imgTroll.height;
			var y = Math.floor(Math.random() * maxY);
			
			// Get context and draw image
			// Need to use [0] index to access context. See here: http://stackoverflow.com/questions/2925130/jquery-equivalent-of-getting-the-context-of-a-canvas
			var ctx = jqCanvas[0].getContext('2d');
			ctx.drawImage(imgTroll, x, y, imgTroll.width, imgTroll.height);
			
			// Set new location
			trollLocation.xMin = x;
			trollLocation.xMax = x + imgTroll.width;
			trollLocation.yMin = y;
			trollLocation.yMax = y + imgTroll.height;
		});
	}
});
