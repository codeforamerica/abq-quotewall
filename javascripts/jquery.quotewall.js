;(function ( $, window, document, undefined ) {
	"use strict";
	
	/* TODO:
	remove quotes from this.going array when they finish
	*/

	// Create the defaults once
	var pluginName = "quotewall",
		defaults = {
			// milliseconds delay between each quote beginning to fall
			interval: 2000,
			// pause an individual quote on mouse hover
			pauseOnHover: true,
			// random left alignment as quotes fall
			randomAlign: true,
			// seconds for a quote to reach the bottom (random between min,max)
			speed: [20, 40],
			// selector for which children are the quotes in the parent container
			selector: 'blockquote',
			filter: null
		};

	// The actual plugin constructor
	function Quotewall( element, options ) {
		this.element = element;
		this.options = $.extend( {}, defaults, options) ;

		this._defaults = defaults;
		this._name = pluginName;

		this.init();
	}

	Quotewall.prototype = {

		init: function() {
			// queue of quotes to animate
			this.queue = [];
			// list of quotes that are currently in motion
			this.going = [];
			
			if (this.options.pauseOnHover) {
				var self = this;
				$(this.element).on('mouseenter.'+pluginName, this.options.selector, function() {
					self.pause(this);
				});
				$(this.element).on('mouseleave.'+pluginName, this.options.selector, function() {
					self.resume(this);
				});
			}
			
			// go!
			this.restart();
		},
		
		restart: function() {
			// stop and clear anthing already moving
			this.stop();
			
			var $all = $(this.element).children(this.options.selector);
			
			// filter
			var filter = this.options.filter;
			if (filter) {
				var $filtered = $all.filter(filter);
				this.queue = $filtered.get();
			} else {
				this.queue = $all.get();
			}
			
			this.hideAll($all);
			this.start();
			
		},
		
		hideAll: function($elements) {
			$elements.css({
				top: 0,
				left: -9999
			});
		},
		
		animateOne: function(el, options) {
			options = options || {};
			
			// quote
			var $el = $(el);
			var height = $el.outerHeight();
			var width = $el.outerWidth();
			
			// wrapper
			var $wrapper = $(this.element);
			var winHeight = $wrapper.height();
			var winWidth = $wrapper.width();
			
			var top = (options.top !== undefined) ? options.top : -height;
			var left = 0;
			if (options.left !== undefined) {
				left = options.left;
			} else if (this.options.randomAlign) {
				left = _.random(0, winWidth - width);
			}
			var speed = this.options.speed;
			var speedMin = 1000 * speed[0];
			var speedMax = 1000 * speed[1];
			var duration = _.random(speedMin, speedMax);
			var self = this;
			
			// initial position
			$el.css({
				left: left,
				top: top
			});
			
			// animate
			$el.animate({
				top: winHeight
			}, {
				duration: duration,
				easing: 'linear',
				complete: function() {
					self.finishOne(el);
				}
			});
		},
		
		finishOne: function(el) {
			this.queue.push(el);
		},
		
		pause: function(el) {
			$(el).stop(true);
		},
		
		resume: function(el) {
			var options = {
				left: $(el).css('left'),
				top: $(el).css('top')
			};
			this.animateOne(el, options);
		},
		
		start: function() {
			var next = $.proxy(this.next, this);
			next();
			this.timer = window.setInterval(next, this.options.interval);
		},
		
		stop: function() {
			// prevent more animations
			if (this.timer) {
				this.timer = window.clearInterval(this.timer);
				this.timer = null;
			}
			// stop the animations that are in progress
			while (this.going.length) {
				var el = this.going.pop();
				$(el).stop(true, true);
			}
		},
		
		next: function() {
			var el = this.queue.shift();
			if (el) {
				this.going.push(el);
				this.animateOne(el);
			}
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, pluginName)) {
				var plugin = new Quotewall(this, options);
				$.data(this, pluginName, plugin);
			}
		});
	};

})( jQuery, window, document );