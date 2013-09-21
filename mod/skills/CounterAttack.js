define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'CounterAttack',
			rate: 20,
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
			var atk = args.caster.atk;
			if (atk.getValue != undefined){
				atk = atk.getValue();
			}
			var damages = parseInt(atk * 0.5);
			args.victim.takeDamages({damages: damages});

			return {
				damages: damages
			};
		};
	};
});