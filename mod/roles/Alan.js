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
		
		this.takeDamages = function(args){
			//args
			// damages int
			// damage_type
			
			if (this.isDead()){
				return;
			}
						
			var c_hp = this.c_hp - args.damages;
				
			if (this.c_hp <= args.damages){
				c_hp = 0;
			}
			else if (c_hp >= this.m_hp){
				c_hp = this.m_hp;
			}
			this.setAttribute("c_hp", c_hp);
		};
		
		this.onEvent = function(evt) {
			var canCastList = [];
			for(var i=0,j=this.equipedSkills.length; i<j; i++){
				if (this.equipedSkills[i].canCast(this, evt)){
					canCastList.push(this.equipedSkills[i]);
				}
			}
			return canCastList;
		};
		
		this.isDead = function(){
			return this.c_hp == 0;
		};
	};
});