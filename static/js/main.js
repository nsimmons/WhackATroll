require(['jquery', 'ImageLoader'], function($, ImageLoader) {

	var trollfacePath = '/images/trollface_small.jpg';
	var imageLoader = new ImageLoader();
	
	var trollLocation = {
		xmin : -1,
		xmax : -1,
		ymin : -1,
		ymax : -1
	};
	
	// Wait for the page to be ready
	$(document).ready( function() {
		// Set click event handler on canvas
		var jqCanvas = $('#screen').click(onCanvasClicked);
		
		// Preload troll image
		imageLoader.loadImage(trollfacePath, startGame);
	});
	
	function onCanvasClicked(e) {
		// Get click location relative to canvas
		var x = Math.floor((e.pageX-$("#screen").offset().left));
		var y = Math.floor((e.pageY-$("#screen").offset().top));
		
		if (trollHit(x,y,trollLocation)) {
			clearTroll();
			placeTroll();
		}
	}
	
	function trollHit(x, y) {
		return (x >= trollLocation.xmin && 
				x <= trollLocation.xmax &&
				y >= trollLocation.ymin && 
				y <= trollLocation.ymax);
	}
	
	function clearTroll() {
		var ctx = $('#screen')[0].getContext('2d');
		ctx.clearRect(trollLocation.xmin, trollLocation.ymin, trollLocation.xmax, trollLocation.ymax);
	}
	
	function startGame() {
		placeTroll();
	}
	
	function placeTroll() {
		// Get trollface image
		imageLoader.loadImage(trollfacePath, function(imgTroll) {
		
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
			
			trollLocation.xmin = x;
			trollLocation.xmax = x + imgTroll.width;
			trollLocation.ymin = y;
			trollLocation.ymax = y + imgTroll.height;
		});
	}
});
