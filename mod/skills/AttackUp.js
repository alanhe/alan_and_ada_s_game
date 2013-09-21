define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: "AttackUp",
			rate: 100,
			triggerEvent: "Passive",
			round : 9999
		});

		this.subCast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party

			args.caster.applyBuff({
				target: "atk",
				type: "percent",
				value: 50,
				round: 99999,
				delay: 0
			});

			return {
			};
		};
	};
});