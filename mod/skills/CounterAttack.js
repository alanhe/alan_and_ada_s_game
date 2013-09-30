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
			var damages = parseInt((args.fromRole.ATK() - args.toRole.DEF()) * 0.5);
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