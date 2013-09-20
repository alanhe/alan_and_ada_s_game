define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'CounterAttack',
			rate: 20,
			triggerEvent: 'BeHit'
		});
		
		this.cast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
			
			var damages = parseInt(args.caster.atk * 0.5);
			args.victim.takeDamages({damages: damages});
			
			this.debuglog(args, damages);
		};
	};
});