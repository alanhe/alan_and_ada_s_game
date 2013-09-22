define(["./EventEmitter", "./Utils"], function(EventEmitter, Utils){
	// Buff:
	//		toRole
	//      value
	//		target
	//		round

	var exports = $.extend({
		buffList: []
	}, new EventEmitter());
	
	exports.newBuff = function(args){
		var buff = {
			toRole: args.toRole,
			target: args.target,//"atk" or "m_hp"
			value: args.value,
			round: args.round ? args.round : 1
		};
		
		//can be override
		buff.canTrigger = function(){
			return true;
		};
		
		//can be override
		buff.applyBuff = function(){
			buff.round--;
			buff.toRole["_buff_" + buff.target] += buff.value;
		};
		
		//can be override
		buff.revertBuff = function(){
			buff.toRole["_buff_" + buff.target] -= buff.value;
		};
		
		//can be override
		buff.isDone = function(){
			return buff.round == 0;
		};
		
		return buff;
	};
	
	exports.updateBuffList = function(){
		for(var i=0; i<exports.buffList.length; i++){
			var buff = exports.buffList[i];
			if (buff.canTrigger()){
				buff.applyBuff();
			}
			if (buff.isDonw()){
				buff.revertBuff();
				exports.buffList.splice(i, 1);
				i--;
			}
		}
	};
	
	exports.addBuff = function(buff){
		buff.applyBuff();
		if(buff.round > 0){
			buffList.push(buff);
		}
	};

	return exports;
});