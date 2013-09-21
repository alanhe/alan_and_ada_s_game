define(["../EventEmitter"], function(EventEmitter){
	return function(){
		$.extend(this, {
			name: '',
			rate: 100,
			round: 1
		}, new EventEmitter());

		this.canCast = function(args){
			return args.moment === this.triggerEvent && Math.random() * 100 < this.rate;
		};
	};
});