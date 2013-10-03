define(["./Jah", "../EquipmentsManager"], function(Jah, EquipmentsManager){
	return function(){
	    $.extend(this, new Jah(), {
	        name: "Alan",
	    });
	    
	    this.getEquipments = function(){
	    	return EquipmentsManager.getEquipments(this);
	    };
	    
	    this.getInventories = function(){
	    	return EquipmentsManager.getInventories(this);
	    };
	    
	    
	   	
	    
	};
});