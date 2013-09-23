define(function(){
	var exports = {};

	exports.newTimer = function(progback, timeInMillis){
		var timer = {
			handler: -1,
			bundle: {
				count: 0
			},
			stop: function(){
				if(timer.handler != -1){
					clearInterval(timer.handler);
					timer.handler = -1;
				}
			}
		};

		timer.handler = setInterval(function(){
			timer.bundle.count += 1;
			console.debug("Tick");
			console.debug(timer.bundle.count);
			progback(timer.bundle);
		}, timeInMillis);
		console.debug("timer.handler = " + timer.handler + " : " + timeInMillis);

		return timer;
	};

	return exports;
});