define(function(){
	var exports = {};

	var intContains = function(iArray, target){
		for(var i = iArray.length - 1; i > -1; --i){
			if(target === iArray[i]){
				return true;
			}
		}
		return false;
	};

	exports.random = function(num, max, min, allowDuplicate){
		// num, number of values return;
		// max, value return, max excluded;
		// min, minimum value return, min included;
		// allowDuplicate;
		if(arguments.length == 0){
			return Math.random();
		}

		var ret = [];
		if($.isNumeric(max)){
			min = min || 0;
			var delta = max - min;
			if(delta < num && !allowDuplicate){
				throw "IllegalArgumentExcpetion";
			}
			while(ret.length < num){
				var newVal = parseInt(Math.random() * delta + min);
				if(allowDuplicate || !intContains(ret, newVal)){
					ret.push(newVal);
				}
			}
		} else {
			while(ret.length < num){
				ret.push(Math.random());
			}
		}
		return ret;
	};

	exports.joinArray = function(array1, array2){
		//all items in arrays will be added to array1
		//caution!!: array1 will be changed
		for(var i=0,j=array2.length; i<j; i++){
			array1.push(array2[i]);
		}
	};

	return exports;
});