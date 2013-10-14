define(["./Jah", "../EquipmentsManager"], function(Jah, EquipmentsManager){
	return function(){
	    $.extend(this, new Jah(), {
	        name: "Alan",
	        inventories: []
	    });

	    this.getInventories = function(){
	    	return this.inventories;
	    };
	};
});