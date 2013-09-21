define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: "AttackUp",
			rate: 100,
			triggerEvent: "Passive"
		});

		this.subCast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
			
			var effectValue = parseInt(args.caster.atk * 0.5);
			args.caster.atk += effectValue;

			return {
				effect: effectValue
			};
		};
	};
});