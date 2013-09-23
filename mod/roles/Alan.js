define(["../EventEmitter", "../skills/Attack"], function(EventEmitter, Attack){
	return function(){
		$.extend(this, {
			// The following attributes are "simple" attributes. The values of them are set as is.
			// Notice: c_hp, c_mp will not be changed proportionally according to m_hp, m_mp.
			//         However, the values should be reduced when they exceed the maximums.
			name: 'Alan',
			c_hp: 0,
			c_mp: 0,
			lv: 1,
			exp: 0,
			gold: 0
		}, {
			// The following properties are "complex" attributes.
			m_hp: 0,
			m_mp: 0,
			atk: 0,
		}, {
			_attrCache: {},
			equipedSkills: [new Attack()]
		}, new EventEmitter());

		this.attr = function(attrName){
			if(!(attrName in this)){ //TODO: Maybe the validation is for DEV only?
				throw attrName + " is not defined in Hero!";
			}
			return this._attrCache[attrName] || (this._attrCache[attrName] = AttrUtils.wrap(this, attrName));
		};

		// Should this function be merged into attr()?
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

		//FIXME: Deprecated!
		this.getValue = function(propName){
			if (this["_buff_" + propName] != undefined){
				return parseInt(this[propName] * this["_buff_" + propName] / 100);
			}
			return this[propName];
		};

		this.takeDamages = function(damages){
			//args
			// damages int
			// damage_type

			if (this.isDead() || damages == 0){
				return;
			}

			var c_hp = this.c_hp - damages;

			if (this.c_hp <= damages){
				c_hp = 0;
			}
			else if (c_hp >= this.getValue("m_hp")){
				c_hp = this.getValue("m_hp");
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