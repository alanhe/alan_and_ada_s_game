define(["./Jah", "../skills/Attack"], function(Jah, Attack){
	return function(){
	    $.extend(this, new Jah(), {
	        name: "Alan",
	        equipedSkills: [new Attack()]
	    });

		// Should this function be merged into attr()?
		this.setAttribute = function(attrName, newVal){
			if(attrName in this){
				var oldVal= this[attrName];
				this[attrName] = newVal;
				this.emit("update", {
					type: attrName,
					oldVal: oldVal,
					newVal: newVal
				});
			}
		};
	};
});