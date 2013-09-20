define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'Attack',
			rate: 100,
			triggerEvent: 'OnAttack'
		});
		
		this.cast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
			
			var damages = parseInt(args.caster.atk * (Math.random() * 0.6 + 0.7));
			args.victim.takeDamages({damages: damages});
			
			this.debuglog(args, damages);
		};
	};
});