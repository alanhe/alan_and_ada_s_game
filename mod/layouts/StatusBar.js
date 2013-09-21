define(["text!./StatusBar.html", "link!./StatusBar.css"], function(sHTML){
	return function(){
		this.setup = function(args){
			// args:
			//	domNode
			//	cssWidth
			//	cssHeight

			this.domNode = $(sHTML);
			this.statusLeft = this.domNode.find(".statusLeft");

			if(args.cssHeight){
				this.domNode.css("height", args.cssHeight);
				this.statusLeft.css("height", args.cssHeight);
			}
			if(args.cssWidth){
				this.domNode.css("width", args.cssWidth);
			}

			this.domNode.appendTo(args.domNode);
		};

		this.destroy = function(){
			this.domNode.remove();
		};

		this.update = function(percent){
			// arguments:
			//   percent: int [0, 100];
			this.statusLeft.css("width", percent + "%");
			this.statusLeft.css("backgroundColor", this.getColor(percent));
		};

		this.getColor = function(percent){
			return "RGB(43, 23, 45)";
		};
	};
});