"use strict";

define('ImageLoader', function() {

	// ImageLoader is reponsible for loading and caching images
	function ImageLoader() {

		// return singleton instance if already created
		// Implemented as suggested by: http://code.google.com/p/jslibs/wiki/JavascriptTips#Singleton_pattern
		if (ImageLoader.prototype._instance) {
			return ImageLoader.prototype._instance;
		}
		ImageLoader.prototype._instance = this;
		
		var images = {};
		
		this.setImageObj = function(src, imageObj) {
			images[src] = imageObj;
		}
		this.getImageObj = function(src) {
			return images[src];
		}
		this.deleteImageObj = function(src) {
			delete image[src];
		}
	}

	ImageLoader.prototype.loadImage = function (src, callback) {

		// Check if image has already been cached
		var imgObj = this.getImageObj(src);
		if (imgObj !== undefined) {
			// If complete return it immediately
			if (imgObj.complete) {
				callback(imgObj.img);
				return;
			}
			
			// Otherwise add callback to list
			imgObj.callbacks.push(callback);
			return;
		}
		
		// Not cached, so create a new object in the cache
		var image = new Image();
		var imgObj = {
			img: image,
			complete: false,
			callbacks : [callback],
			onLoad: function() {
				this.complete = true;
				for (var i = 0; i < this.callbacks.length; i++) {
					this.callbacks[i](this.img);
				}
			}
		};
		
		image.onload = function() {
		
			// Make sure image is not of size 0. 
			// That would mean that it did not successfully load
			// Some browsers support natural<x>, some don't
			if ('naturalHeight' in this) {
				if (this.naturalHeight + this.naturalWidth === 0) {
					this.onerror();
					return;
				}
			} else if (this.width + this.height == 0) {
				this.onerror();
				return;
			}
			
			// Call parent object's onLoad to handle multiple potential callbacks
			imgObj.onLoad();
		};
		
		// Throw an error that will be visible in debug console
		image.onerror = function() {
			throw('Failed to load image ' + this.src);
		};
		image.src = src;
		
		// Save in image cache for later retrieval
		this.setImageObj(src, imgObj);
	}
	
	return ImageLoader;
});