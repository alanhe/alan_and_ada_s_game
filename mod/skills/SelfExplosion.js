define(["./Skill"], function(Skill){
	return function(){
		$.extend(this, new Skill(), {
			name: 'SelfExplosion',
			rate: 100,
			triggerEvent: 'OnDie'
		});

		this.subCast = function(args){
			// args:
			//	caster
			//	victim
			//	party1, self party
			//	party2, enemy party

			var damages = parseInt(args.caster.m_hp * 0.4);
			for(var i = 0, party2 = args.party2; i < party2.length; ++i){
				party2[i].takeDamages({damages: damages});
			}

			return {
				toName: {},
				damages: damages
			};
		};
	};
});