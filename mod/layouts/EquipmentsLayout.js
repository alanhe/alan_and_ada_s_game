define(["text!./EquipmentsLayout.html", "link!./EquipmentsLayout.css"], function(sHTML){
	return function(){
		this.setup = function(args){
			this.hero = args.hero;
			this.domNode = $(sHTML);
			
			
			this.domNode.appendTo(args.domNode);
		};
		
		this.destroy = function(){
			this.domNode.remove();
		};
	};
});