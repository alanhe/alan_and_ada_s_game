define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'Attack',
			rate: 100,
			triggerEvent: 'OnAttack'
		});

		this.cast = function(args){
			var damages = parseInt(args.fromRole.ATK() - args.toRole.DEF());
			if(damages < 1){
				damages = 1;
			}
			args.toRole.CHP(-damages, true);

			return {
				fromName: args.fromRole.name,
				toName: args.toRole.name,
				damages: damages,
				skillName: this.name
			};
		};
	};
});