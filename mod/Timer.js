define(function(){
	var exports = {};

	exports.newTimer = function(progback, timeInMillis){
		var timer = {
			handler: -1,
			interrupt: function(){
				if(this.handler !== -1){
					clearTimeout(this.handler);
					this.handler = -1;
				}
			},
			bundle: {
				count: 0
			},
			stop: function(){
				clearTimeout(this.handler);
				this.handler = -1;
			}
		};

		var timerCallback = function(){
			timer.bundle.count += 1;
			progback(timer.bundle);
			timer.handler = setTimeout(timerCallback, timeInMillis);
		};

		timer.handler = setTimeout(timerCallback, timeInMillis);
		return timer;
	};

	return exports;
});