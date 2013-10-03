define(["text!./ProgressBar.html", "link!./ProgressBar.css"], function(sHTML){
	return function(){
		this.handler = -1;
		this.setup = function(args){
			// args:
			//	domNode
			//	cssWidth
			//	cssHeight
			//  timeInMillis
			this.timeInMillis = args.timeInMillis;
			this.domNode = $(sHTML);
			this.progPrecent = this.domNode.find(".progPrecent");

			this.domNode.appendTo(args.domNode);
		};

		this.start = function(){
			this.progPrecent.stop().animate({
				width: "100%"
			}, this.timeInMillis);
		};

		this.destroy = function(){
			this.interrupt();
			this.domNode.remove();
		};

		this.interrupt = function(){
			this.domNode.stop();
		};

		this.update = function(percent){
			// arguments:
			//   percent: int [0, 100];
			this.progPrecent.stop().animate({
				width: percent + "%"
			}, "fast");
		};
	};
});