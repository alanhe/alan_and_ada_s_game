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

		this.update = function(cVal, mVal){
			// arguments:
			//   percent: int [0, 100];
			var percent = parseInt(cVal * 100 / mVal);
			this.statusLeft.css("width", percent + "%");
			this.statusLeft.css("backgroundColor", this.getColor(percent));
			this.statusLeft.attr("title", cVal + "/" + mVal);
		};

		this.getColor = function(percent){
			var color;
		    if (percent >= 50) {
		        color = 'RGB(139,238,132)';
		    }
		    else if (percent >= 20) {
		        color = 'RGB(215,174,111)';
		    }
		    else {
		        color = 'RGB(164,72,72)';
		    }
			return color;
		};
	};
});