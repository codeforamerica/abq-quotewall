;(function ( $, window, document, undefined ) {

	// Create the defaults once
	var pluginName = "quotewall",
		defaults = {
			// milliseconds delay between each quote beginning to fall
			interval: 2000,
			// seconds for a quote to reach the bottom (random between min,max)
			speed: [20, 40]
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
			// Place initialization logic here
			// You already have access to the DOM element and
			// the options via the instance, e.g. this.element
			// and this.options
			// you can add more functions like the one below and
			// call them like so: this.yourOtherFunction(this.element, this.options).
			
			// queue of quotes to animate
			var $element = $(this.element);
			var $children = $element.children();
			
			// TODO: filter
			
			this.hideAll($children);
			
			this.queue = $children.get();
			
			this.start();
			
		},
		
		hideAll: function($elements) {
			$elements.css({
				top: 0,
				left: -9999
			});
		},
		
		animateOne: function(el, index) {
			var $el = $(el);
			var $wrapper = $(this.element);
			var height = $el.outerHeight();
			var width = $el.outerWidth();
			var winHeight = $wrapper.height();
			var winWidth = $wrapper.width();
			var minHeight = 0 - height;
			var maxHeight = winHeight;
			var top = -height;
			var left = _.random(0, winWidth - width);
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
				top: maxHeight
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
		
		start: function() {
			var next = $.proxy(this.next, this);
			next();
			this.timer = window.setInterval(next, this.options.interval);
		},
		
		stop: function() {
			console.log('stopped');
			if (this.timer) {
				this.timer = window.clearInterval(this.timer);
				this.timer = null;
			}
		},
		
		next: function() {
			var el = this.queue.shift();
			if (el) {
				this.animateOne(el);
			}
		}
	};

	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function ( options ) {
		return this.each(function () {
			if (!$.data(this, "plugin_" + pluginName)) {
				$.data(this, "plugin_" + pluginName,
				new Quotewall( this, options ));
			}
		});
	};

})( jQuery, window, document );