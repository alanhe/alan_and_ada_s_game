define(["../EventEmitter"], function(EventEmitter){
	return function(){
		$.extend(this, {
			name: '',
			rate: 0,
			triggerEvent: ''
		}, new EventEmitter());
		
		this.subCanCast = function(caster, evt){
			return false;
		};
		
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
			return this.subCanCast(caster, evt);
		};
		
		this.cast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
			
			var castRet = this.subCast(args);
			
			this.debuglog(args, castRet);

			var ret = {
				fromName: args.caster.name,
				toName: args.victim.name,
				skillName: this.name,
				damages: castRet.damages
			};	
			if (castRet.toName != undefined){
				ret.toName = castRet.toName;
			}		
			
			return ret;
		};
		
		this.debuglog = function(args, castRet){
			if (castRet.damages != undefined){
				console.log(args.caster.name + " " + this.name + " triggered, damages " + castRet.damages + ". " + args.victim.name + " hp left " + args.victim.c_hp + ".");
			}
		};
	};
});