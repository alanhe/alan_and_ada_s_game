define(["./Skill"], function(Skill) {
	return function() {
		$.extend(this, new Skill(), {
			name : 'SelfExplosion',
			rate : 20,
			triggerEvent : 'OnDying'
		});

		this._canCast = this.canCast;

		this.canCast = function(args) {
			if (!args.fromRole.isDead()) {
				return false;
			}
			return this._canCast(args);
		};

		this.cast = function(args) {
			var m_hp = args.fromRole.getValue("m_hp");
			var damages = parseInt(m_hp * 0.4);
			for (var i = 0; i < args.toParty.length; ++i) {
				args.toParty[i].takeDamages(damages);
			}

			return {
				fromName : args.fromRole.name,
				toName : {},
				damages : damages,
				skillName : this.name
			};
		};
	};
});