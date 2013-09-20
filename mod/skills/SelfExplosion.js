define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'SelfExplosion',
			rate: 50,
			triggerEvent: 'OnDie'
		});
		
		this.cast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party
			
			var damages = parseInt(args.caster.m_hp * 0.4);
			args.victim.takeDamages({damages: damages});
			
			this.debuglog(args, damages);
		};
	};
});