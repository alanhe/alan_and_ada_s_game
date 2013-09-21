define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: "AttackUp",
			rate: 100,
			triggerEvent: "OnPassive",
			round : 9999
		});

		this.cast = function(args){
			args.fromRole.applyBuff({
				target: "atk",
				type: "percent",
				value: 50,
				round: 99999,
				delay: 0
			});

			return {
				fromName: args.fromRole.name,
				toName: args.fromRole.name,
				damages: 0,
				skillName: this.name
			};
		};
	};
});