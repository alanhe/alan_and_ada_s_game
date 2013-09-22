define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'CounterAttack',
			rate: 30,
			triggerEvent: 'OnBeHit'
		});

		this._canCast = this.canCast;

		this.canCast = function(args){
			if(args.fromRole.isDead()){
				return false;
			}
			return this._canCast(args);
		};

		this.cast = function(args){
			var atk = args.fromRole.getValue("atk");
			var damages = parseInt(atk * 0.5);
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