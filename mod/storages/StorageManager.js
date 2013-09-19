define(function(){
	return function(){

		var self = this;


		// Utility functions:
		this.parse = function(sJSON){
			return JSON.parse(sJSON);
		};

		this.stringify = function(obj){
			var dup = {},
				key,
				val;
			for(key in obj){
				if(key[0] != "_"){ //Attributes start with "_" do not serialize/deserialize for storage.
					val = obj[key];
					if(!$.isFunction(val)){
						dup[key] = val;
					}
				}
			}
			return JSON.stringify(dup);
		};


	};
});