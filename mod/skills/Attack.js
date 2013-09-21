define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'Attack',
			rate: 100,
			triggerEvent: 'OnAttack'
		});

		this.cast = function(args){
			var atk = args.fromRole.atk;
			if (atk.getValue){
				atk = atk.getValue();
			}
			var damages = parseInt(atk * (Math.random() * 0.6 + 0.7));
			args.toRole.takeDamages(damages);

			return {
				fromName: args.fromRole.name,
				toName: args.toRole.name,
				damages: damages,
				skillName: this.name
			};
		};
	};
});