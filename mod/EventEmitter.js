define(function(){
	return function(){
		this._listeners = {};
		
		this.on = function(event, listener){
			var listeners = this._listeners[event] || [];
			listeners.push(listener);
			this._listeners[event] = listeners;
		};
		
		this.off = function(event, listener){
			var listeners = this._listeners[event];
			if(listeners){
				//FIXME: How to compare two functions equal?
				listener = listener.toString();
				for(var i = listeners.length - 1; i > -1; --i){
					if(listeners[i].toString() === listener){
						listeners.splice(i, 1);
					}
				}
			}
		};
		
		this.emit = function(event){
				var args = Array.prototype.slice.call(arguments, 1),
				listeners = this._listeners[event];
			
			if(listeners){
				for(var i = listeners.length - 1; i > -1; --i){
					listeners[i].apply(this, args);
				}
			}
		};
	};
});