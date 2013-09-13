function StatusBar(args){
	// args:
	//		Alan - alan
	//		domNode - root node, jQuery object.
	var Alan = args.Alan,
		domNode = args.domNode;
	
	var exports = {};
	
	exports.init = function(){
		domNode.append('<span><strong>Alan</strong></span>');
		domNode.append('<span class="n-box n-border"><label>HP</label><span class="c_hp">' + Alan.c_hp + '</span>/' + Alan.m_hp + '</span>');
		domNode.append('<span class="n-box n-border"><label>MP</label>' + Alan.c_mp + '/' + Alan.m_mp + '</span>');
		domNode.append('<span class="n-box n-border"><label>ATTACK<label>' + Alan.atk + '</span>');
		domNode.append('<span class="n-box n-border"><label>Gold</label><span class="gold">' + Alan.gold + '</span></span>');
		domNode.append('<span class="n-box n-border"><label>EXP</label><span class="exp">' + Alan.exp + '</span></span>');
	};
	
	exports.set = function(attr, sVal){
		domNode.find('.' + attr).text(sVal);
	};
	
	return exports;
};