define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'CounterAttack',
			rate: 100,
			triggerEvent: 'BeHit'
		});

		this.canCast = function(caster, evt){
			if (caster.isDead()){
				return false;
			}
			if (evt != this.triggerEvent){
				return false;
			}
			if (this.rate == 100){
				return true;
			}
			if (parseInt(Math.random() * 100) < this.rate) {
				return true;
			}
			return false;
		};

		this.cast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
			var damages = parseInt(args.caster.atk * 0.5);
			args.victim.takeDamages({damages: damages});

			this.debuglog(args, damages);

			return {
				fromName: args.caster.name,
				toName: args.victim.name,
				skillName: this.name,
				damages: damages
			};
		};
	};
});