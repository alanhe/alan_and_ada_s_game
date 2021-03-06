define(function(){
	var _cache = {},
	      exports = {};

	var intContains = function(iArray, target){
		for(var i = iArray.length - 1; i > -1; --i){
			if(target === iArray[i]){
				return true;
			}
		}
		return false;
	};

	exports.randomDraw = function(oArray, attrName){
		// args:
		// oArray - an object array. Every item in the array has a "probable" attribute to indicate its probability to be drawn.
		//             The name of the attribute is "probable" by default.
		attrName = attrName || "probable";

		var valTotal = (function(oArr){
				var sum = 0;
				for(var i = oArray.length - 1; i > -1; --i){
					sum += oArray[i][attrName];
				}
				return sum;
			})(oArray),
			valRandom = Math.random() * valTotal;
		var sum = 0;
		for(var i = 0, l = oArray.length - 1; i < l; ++i){
			if((sum += oArray[i][attrName]) > valRandom){
				break;
			}
		}
		return {
			i: i,
			item: oArray[i]
		};
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
				return null;
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
		var ret = [];
			//TODO: return new array;
		return ret;
	};

	exports.appendArray = function(array1, array2){
		for(var i=0,j=array2.length; i<j; i++){
			array1.push(array2[i]);
		}
	};

	exports.createUUID = function(){
		return ([1e7] + -1e3 + -4e3 + -8e3 + -1).replace(/[018]/g, function(a){
			return (a ^ Math.random() * 16 >> a/4).toString(16);
		}) + Date.now().toString(16);
	};
	
    exports.randomString = function(minSize, maxSize, allowAll){
        var  i, cache = _cache["KEY_VALID_CHARS"];
        if(!cache){
            cache = [];
            for(i = 48; i <= 57; ++i){ // number 0 - 9
                cache.push(String.fromCharCode(i));
            }
            for(i = 65; i <= 90; ++i){ // alphabet a - z
                cache.push(String.fromCharCode(i));
            }
            for(i = 97; i <= 122; ++i){ // alphabet A - Z
                cache.push(String.fromCharCode(i));
            }
            _cache["KEY_VALID_CHARS"] = cache;
        }
        
        var ret = "",
            randNum = minSize + parseInt(Math.random() * (maxSize - minSize));
        for(i = 0; i < randNum; ++i){
            if(!allowAll && (i === 0 || i === randNum - 1)){
                ret += cache[10 + parseInt(Math.random() * (cache.length - 10))]; // not starts or ends with number;            
            } else {
                ret += cache[parseInt(Math.random() * cache.length)];
            }
        }
        return ret;
    };

	return exports;
});