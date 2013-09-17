define(["text!./HeroLayout.html", "link!./HeroLayout.css"], function(sHTML){

	var sDisplayAttrs = ["name", "c_hp", "m_hp", "c_mp", "m_mp", "atk", "lv", "exp", "gold"];
	
	return function(){
		
		var hero,
            domNode,
		    labels = {};
		
		var _heroLayout_on_update_handler = function(evt){
			labels[evt.type].text(evt.newVal);
		};
		
		this.setup = function(args){
			hero = args.hero;
			domNode = $(args.domNode);
			
			// _init_dom:
			domNode.html(sHTML);
			for(var i = sDisplayAttrs.length - 1; i > -1; --i){
			    var key = sDisplayAttrs[i];
			    
			    labels[key] = domNode.find("." + key);
			    labels[key].text(hero[key]);
			}
			
			// _init_listener:
			hero.on("update", _heroLayout_on_update_handler);
		};
		
		this.destroy = function(){
			hero.off("update", _heroLayout_on_update_handler);
			hero = domNode = labels = null;
		};
	};
});