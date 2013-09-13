function Fight(args){
	var timeInMillis = 1000;
	
	exports = {};
	
	exports.onEnd = function(){
		args.callback();
	};
	
	exports.damage = function(obj1, obj2){
		obj1.c_hp -= obj2.atk;
	};
	
	exports.fight = function(obj1, obj2, onSuccess, onFailure){
		if(!('c_mp' in obj2)){
			obj2.c_hp = obj2.m_hp;
		}
		
		exports.log('遭遇怪物' + obj2.name + ', HP:' + obj2.m_hp + ' ATK:' + obj2.atk);
		
		var eventEmitter = {
			_listeners: {},
			on: function(event, listener){
				var listeners = this._listeners[event] || [];
				listeners.push(listener);
				this._listeners[event] = listeners;
			},
			emit: function(event){
				var args = Array.prototype.slice.call(arguments, 1),
					listeners = this._listeners[event];
				if(listeners){
					for(var i = listeners.length - 1; i > -1; --i){
						listeners[i](args);
					}
				}
			}
		};

		var objs = [obj2, obj1];
		
		var timerFunc = function(){
			timerHandler = setTimeout(timerFunc, timeInMillis);
			objs.reverse();
			eventEmitter.emit('tick');
		};
		
		var timerHandler = setTimeout(timerFunc, timeInMillis);
		
		eventEmitter.on('tick', function(){
			exports.damage(objs[1], objs[0]);
			exports.log(objs[0].name + '攻击' + objs[1].name + '造成' + objs[0].atk + '点伤害,剩余' + objs[1].c_hp + 'hp.');
			if(objs[0].c_hp <= 0 || objs[1].c_hp <= 0){
				clearTimeout(timerHandler);
				exports.log(objs[1].name + '死亡,战斗结束.');
				if(obj1.c_hp <= 0){
					obj1.c_hp = 1;
					onFailure(obj2);
				} else {
					onSuccess(obj2);
				}
			}
		});
	};
	
	return exports;
}


