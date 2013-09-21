define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'Attack',
			rate: 100,
			triggerEvent: 'OnAttack'
		});

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
			var damages = parseInt(atk* (Math.random() * 0.6 + 0.7));
			args.victim.takeDamages({damages: damages});

			return {
				damages: damages
			};
		};
	};
});