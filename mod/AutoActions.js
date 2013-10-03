define(["./EventEmitter"], function(EventEmitter){
	var exports = new EventEmitter();
	exports.onGoingEvent = null; // point to the current active event, controlled by invoker;

	var autoRestoreStatus = new EventEmitter();
	autoRestoreStatus.handler = -1;
	autoRestoreStatus.start = function(){
		var self = this,
			timeInMillis = 2000 + parseInt(Math.random() * 3) * 1000; // [2000, 5000)

		this.handler = setTimeout(function(){
			self.emit("finish");
		}, timeInMillis);
		this.emit("start", timeInMillis);
	};
	autoRestoreStatus.on("interrupt", function(){
		clearTimeout(autoRestoreStatus.handler);
	});

	//--------------------------------------------------------------------
	var autoSearch = new EventEmitter();
	autoSearch.handler = -1;
	autoSearch.start = function(){
		var self = this,
			timeInMillis = 2000 + parseInt(Math.random() * 3) * 1000; // [2000, 5000)
		autoSearch.handler = setTimeout(function(){
			var findings = {};
			// Randomly find something, add to finding.
			self.emit("finish", findings);
		}, timeInMillis);
		this.emit("start", timeInMillis);
	};
	autoSearch.on("interrupt", function(){
		clearTimeout(autoSearch.handler);
	});

	//--------------------------------------------------------------------
	var autoFight = new EventEmitter();
	autoFight.start = function(){
		this.emit("start");
	};

	//--------------------------------------------------------------------

	exports.restoreStatus = autoRestoreStatus;
	exports.search = autoSearch;
	exports.fight = autoFight;

	var randomEvent = [autoSearch, autoFight];
	exports.drawEvent = function(){
		randomEvent[parseInt(Math.random() * randomEvent.length)].start();
	};

	exports.interrupt = function(){
		if(this.onGoingEvent != null){
			this.onGoingEvent.emit("interrupt");
		}
		exports.emit("auto_message_interrupt");
	};

	return exports;
});