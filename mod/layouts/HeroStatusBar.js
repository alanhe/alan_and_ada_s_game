define(["text!./HeroStatusBar.html", "link!./HeroStatusBar.css"], function(sHTML){
	return function(){
		this.setup = function(args){
			// args:
			//	domNode
			//  label

			this.domNode = $(sHTML);
			this.statusLeft = this.domNode.find(".statusLeft");
			if(args.label){
				var nodeLabel = this.domNode.find(".label");
				if(typeof args.label === "string"){
					nodeLabel.html(args.label);
				} else {
					args.label.addClass("label");
					nodeLabel.replaceWith(args.label);
				}
			}
			this.domNode.appendTo(args.domNode);
		};

		this.update = function(newPercent){
			// arguments:
			//   newPercent: int [0, 100];
			this.statusLeft.stop().animate({
				width: newPercent + "%"
			}, "fast");
		};

		this.destroy = function(){
			this.domNode.remove();
		};
	};
});