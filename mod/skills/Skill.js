define(["../EventEmitter"], function(EventEmitter){
	return function(){
		$.extend(this, {
			name: '',
			rate: 0,
			triggerEvent: ''
		}, new EventEmitter());
		
		this.canCast = function(caster, evt){
			if (evt != this.triggerEvent){
				return false;
			}
			if (this.rate == 100){
				return true;
			}
			if (parseInt(Math.random() * 100) < this.rate) {
				return true;
			}
			return false;
		};
		
		this.cast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
		};
		
		this.debuglog = function(args, damages){
			console.log(args.caster.name + " " + this.name + " triggered, damages " + damages + ". " + args.victim.name + " hp left " + args.victim.c_hp + ".");
		};
	};
});