define(["../EventEmitter", "../skills/Attack"], function(EventEmitter, Attack){
	return function(){
		$.extend(this, {
			name: 'Alan',
			c_hp: 0,
			m_hp: 0,
			c_mp: 0,
			m_mp: 0,
			exp: 0,
			lv: 1,
			atk: 0,
			gold: 0,
			equipedSkills: [new Attack()]
		}, new EventEmitter());

		this.setAttribute = function(attrName, newVal){
			if(attrName in this){
				var oldVal= this[attrName];
				this[attrName] = newVal;
				this.emit("update", {
					type: attrName,
					oldVal: oldVal,
					newVal: newVal
				});
			}
		};

		this.takeDamages = function(damages){
			//args
			// damages int
			// damage_type

			if (this.isDead()){
				return;
			}

			var c_hp = this.c_hp - damages;

			if (this.c_hp <= damages){
				c_hp = 0;
			}
			else if (c_hp >= this.m_hp){
				c_hp = this.m_hp;
			}
			this.setAttribute("c_hp", c_hp);
		};

		this.getSkills = function(){
			return this.equipedSkills;
		};

		this.isDead = function(){
			return this.c_hp == 0;
		};
	};
});