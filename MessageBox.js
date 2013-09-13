function MessageBox(args){
	//args:
	//	domNode - container node
	var exports = {},
		domNode = args.domNode,
		length = 0,
		m_length = 10;
	
	exports.add = function(message){
		if(length == m_length){
			domNode.children().last().remove();
			--length;
		}
		domNode.prepend('<p>' + message + '</p>');
		++length;
	};
	
	exports.size = function(){
		return length;
	};
	
	exports.clear = function(num){
		if(!num){
			domNode.emtpy();
			length = 0;
		} else {
			var size = Math.min(length, num),
				children = domNode.children();
			for(var i = 0; i < size; ++i){
				children.last().remove();
			}
			length -= size;
		}
	};
	return exports;
}