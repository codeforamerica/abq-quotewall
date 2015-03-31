(function($) {

var QuoteWall = Backbone.View.extend({
	events: {
		//'change #film-type': 'render'
	},
		
	initialize: function(options) {
		
		this.options = options || {};
		this.quotes = this.options.quotes;
		
		// queue of quotes to animate
		this.queue = [];
		for (var i = 0; i<this.quotes.length; i++) {
			this.queue.push(i);
		}
		
		// animate this many quotes at once
		var num = 10;
		
		// initial batch
		for (var i = 0, len = this.queue.length; i < num && i < len; i++) {
			this.next();
		}
	},
	
	renderOne: function(index) {
		var index = index || 0;
		var $quotes = this.$el;		
		var template = _.template($('script#quote-template').html());
		var quote = this.quotes[index];
		
		var html = template({
			quote: quote
		});
		
		var $quote = $(html).appendTo($quotes);
		return $quote;
	},
	
	animateOne: function($quote, index) {
		var height = $quote.outerHeight();
		var width = $quote.outerWidth();
		var winHeight = this.$el.height();
		var winWidth = this.$el.width();
		var minHeight = 0 - height;
		var maxHeight = winHeight;
		//var top = _.random(minHeight, maxHeight);
		var top = -height;
		var left = _.random(0, winWidth - width);
		var seconds = _.random(20, 30);
		var self = this;
		
		// initial position
		$quote.css({
			translateY: top,
			left: left
		});
		
		// animate
		$quote.velocity({
			translateY: maxHeight
		}, {
			duration: seconds * 1000,
			easing: 'linear',
			complete: function(elements) {
				self.finishOne(index, $quote);
				self.next();
			}
		});
	},
	
	finishOne: function(index, $quote) {
		console.log('done!', index);
		$quote.remove();
		this.queue.push(index);
	},
	
	next: function() {
		var index = this.queue.shift();
		var $quote = this.renderOne(index);
		this.animateOne($quote, index);
	}
});

$(document).ready(function() {
	var app = new QuoteWall({
		el: $('#quotes')[0],
		quotes: quotes
	});
	window.app = app;
});

})(jQuery)