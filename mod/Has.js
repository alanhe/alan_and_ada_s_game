define(function(){
	// Thanks to Dojo~
	var _cache = {},
		exports = {};

	exports.has = function(key, val){
		if(typeof val === "undefined"){
			val = _cache[key];
			return $.isFunction(val) ? _cache[key] = val() : val;
		}
		_cache[key] = val;
	};
	return exports;
});