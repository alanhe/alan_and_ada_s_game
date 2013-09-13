function JobQueue(){
	var exports = {};
	
	var jobQueue = [];
	
	exports.size = function(){
		return jobQueue.length;
	};
	
	exports.add = function(task){
		jobQueue.push(task);
	};
	
	exports.pop = function(){
		return jobQueue.pop();
	};
	
	exports.pick = function(){
		return jobQueue[jobQueue.length -1];
	};
	
	return exports;
}