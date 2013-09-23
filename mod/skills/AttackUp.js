define(["./Skill", "../BuffManager"], function(Skill, BuffManager){
	return function(){
		$.extend(this, new Skill(), {
			name: "AttackUp",
			rate: 100,
			triggerEvent: "OnPassive",
			round : 9999
		});

		this.cast = function(args){
			/*
			var buff = BuffManager.newBuff({
				toRole: args.fromRole,
				target: "atk",
				value: 50,
				round: this.round
			});

			//passive skill should manually apply buff
			buff.applyBuff();

			return {
				fromName: args.fromRole.name,
				toName: args.fromRole.name,
				damages: 0,
				skillName: this.name,
				buff: buff
			};*/
			console.debug("Casting AttackUp");
			return {
				fromName: args.fromRole.name,
				toName: args.fromRole.name,
				damages: 0,
				skillName: this.name
			};
		};
	};
});