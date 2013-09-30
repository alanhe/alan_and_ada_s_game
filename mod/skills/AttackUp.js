define(["./Skill", "../BuffManager"], function(Skill, BuffManager){
	return function(){
		$.extend(this, new Skill(), {
			name: "AttackUp",
			rate: 100,
			triggerEvent: "OnPassive",
			round : 9999
		});

		this.cast = function(args){
			args.fromRole.ATKMRT(40, true);

			return {
				fromName: args.fromRole.name,
				toName: args.fromRole.name,
				damages: 0,
				skillName: this.name
			};
		};
	};
});