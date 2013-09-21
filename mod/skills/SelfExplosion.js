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
			var m_hp = args.caster.m_hp;
			if (m_hp.getValue != undefined){
				m_hp = m_hp.getValue();
			}
			var damages = parseInt(m_hp * 0.4);
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