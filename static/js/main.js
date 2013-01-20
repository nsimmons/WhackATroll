require(['jquery', 'ImageLoader'], function($, ImageLoader) {

	// Wait for the page to be ready
	$(document).ready( function() {
	
		// Get the canvas by ID, and then the context
		// Need to use [0] index to access context. See here: http://stackoverflow.com/questions/2925130/jquery-equivalent-of-getting-the-context-of-a-canvas
		var canvas = $('#screen');
		var ctx = canvas[0].getContext('2d');

		// Load troll image
		var imageLoader = new ImageLoader();
		imageLoader.loadImage('/images/trollface_small.jpg', function(imgTroll) {
			ctx.drawImage(imgTroll, 0, 0, 70, 57);
			ctx.drawImage(imgTroll, 100, 100, 70, 57);
		});
	});
});
