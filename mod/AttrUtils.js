define(function(){
	var exports = {};

	// Passive Skills and Equipments may effect a hero's ability. The effects are tracked ( , may also think them as been cached) in the role,
	// for example, if a hero has an attributes "ATK" that will be changed frequently by taking on/off weapons,
	// we define a series of related attributes:
	//    _delta_a_atk - a delta value that adds to the hero's attack points;
	//    _delta_r_atk - an ratio value that multiples attack points;
	//    _buff_r_atk - similar to _delta_r_atk, the difference between the two is that _buff_r_atk only takes value during a fight.
	//						When a fight is ended, the value for the attribute is set to zero.
	// The final attack points is calculated like this: int( atk * (100 + _delta_r_atk + _buff_r_atk) / 100 + _delta_a_atk )
	exports.wrap = function(obj, attrName){
		var ret = {};

		ret.valDeltaA = function(newVal){
			if(typeof newVal !== "number"){
				return obj["_delta_a_" + attrName] || 0;
			}
			obj["_delta_a_" + attrName] = newVal;
		};

		ret.addDeltaA = function(newVal){
			ret.valDeltaA(ret.valDeltaA() + newVal);
		};

		ret.valDeltaR = function(newVal){
			if(typeof newVal !== "number"){
				return obj["_delta_r_" + attrName] || 0;
			}
			obj["_delta_r_" + attrName] = newVal;
		};

		ret.addDeltaR = function(newVal){
			ret.valDeltaR(ret.valDeltaR() + newVal);
		};

		ret.valBuffR = function(newVal){
			if(typeof newVal !== "number"){
				return obj["_buff_r_" + attrName] || 0;
			}
			obj["_buff_r_" + attrName] = newVal;
		};

		ret.addBuffR = function(newVal){
			ret.valBuffR(ret.valBuffR() + newVal);
		};

		ret.val = function(){
			return parseInt(obj[attrName] / 100 * (100 + ret.valBuffR() + ret.valDeltaR()) + ret.valDeltaA());
		};

		return ret;
	};
	return exports;
});