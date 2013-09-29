define(["./Jah"], function(Jah){
	return function(){
	    $.extend(this, new Jah(), {
	        name: "Alan",
	    });
	};
});