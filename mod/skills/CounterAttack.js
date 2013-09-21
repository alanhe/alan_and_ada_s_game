define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'CounterAttack',
			rate: 100,
			triggerEvent: 'BeHit'
		});

		this.subCanCast = function(caster, evt){
			if (caster.isDead()){
				return false;
			}
			return true;
		};

		this.subCast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
			var damages = parseInt(args.caster.atk * 0.5);
			args.victim.takeDamages({damages: damages});

			return {
				damages: damages
			};
		};
	};
});