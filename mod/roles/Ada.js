define(["../EventEmitter", "../skills/Attack"], function(EventEmitter, Attack){
	var Property = function(propName){
		$.extend(this, {
			name: propName,
			current: 0,
			basic: 0,
			max: -1,
			min: 0
		});
		
		this.init = function(initValue, maxValue, defaultValue){
			this.current = initValue;
			if (maxValue != undefined){
				this.max = maxValue;
			}
			if (defaultValue != undefined){
				this.basic = defaultValue;
			}
			else{
				this.basic = this.current;
			}
		};
		
		this.addValue = function(value){
			var ret = this.current + value;
			if (ret < this.min){
				this.current = this.min;
			}
			else if (this.max != -1 && ret > this.max ){
				this.current = this.max;
			}
			else{
				this.current = ret;
			}
		};
		
		this.getValue = function(){
			return this.current; 
		};
	};
	
	return function(){
		$.extend(this, {
			name: 'Ada',
			c_hp: 0,
			m_hp: new Property("m_hp"),
			c_mp: 0,
			m_mp: 0,
			exp: 0,
			lv: 1,
			atk: new Property("atk"),
			gold: 0,
			drop_rate: 100,
			titles: [],
			equipedSkills: [new Attack()],
			_buffList: []
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
				
			if (c_hp < 0){
				c_hp = 0;
			}
			else if (c_hp > this.m_hp.getValue()){
				c_hp = this.m_hp.getValue();
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
		
		this.applyBuff = function(args){
			//args
			// target: "m_hp" or "atk"
			// type: "add" or "percent"
			// value: int
			// round: int >= 0
			// delay: int >= 0
			
			var effectValue;
			var property = this[args.target];
			if (args.type == "add"){
				effectValue = value;
			}
			else if (args.type == "percent"){
				effectValue = parseInt(property.basic * args.value / 100);
			}
			
			if (args.delay == undefined){
				args.delay = 0;
			}
			if (args.round == undefined){
				args.round = 1;
			}
			
			if (args.delay == 0 && args.round == 1){
				property.addValue(effectValue);
			}
			else{
				this._buffList.push({
					value: effectValue,
					property: property,
					round: args.round,
					delay: args.delay
				});
			}
		};
	
		this.newRound = function(){
			this.m_hp.current = this.m_hp.basic;
			this.atk.current = this.atk.basic;
			
			for(var i=0; i<this._buffList.length; i++){
				var buff = this._buffList[i];
				if (buff.round == 0){
					_buffList.splice(i, 1);
					i--;
				}
				else if (buff.delay > 0){
					buff.delay--;
				}
				else if (buff.round > 0){
					buff.property.addValue(buff.value);
					buff.round--;
				}
			}
		};
	};
});