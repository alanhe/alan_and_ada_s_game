define(["../EventEmitter"], function(EventEmitter){
	return function(){
		$.extend(this, {
			name: 'Ada',
			c_hp: 0,
			m_hp: 0,
			c_mp: 0,
			m_mp: 0,
			exp: 0,
			lv: 1,
			atk: 0,
			gold: 0,
			drop_rate: 100,
			title: ''
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
	};
});