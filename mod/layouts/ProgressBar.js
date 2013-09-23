define(["text!./ProgressBar.html", "link!./ProgressBar.css"], function(sHTML){
	return function(){
		this.handler = -1;
		this.setup = function(args){
			// args:
			//	domNode
			//	cssWidth
			//	cssHeight
			//  timeInMillis

			this.tickTime = parseInt(args.timeInMills / 15);
			this.tickValue = 100 / 15;

			this.domNode = $(sHTML);
			this.progPrecent = this.domNode.find(".progPrecent");

			this.domNode.appendTo(args.domNode);
		};

		this.start = function(){
			var self = this,
			    c = 0;

			var doTick = function(){
				c += self.tickValue;
				c = c > 100 ? 100 : c;

				self.update(c);

				if(c < 100){
					self.handler = setTimeout(doTick, self.tickTime);
				}
			};
			self.handler = setTimeout(doTick, self.tickTime);
		};

		this.destroy = function(){
			this.interrupt();
			this.domNode.remove();
		};

		this.interrupt = function(){
			if(this.handler != -1){
				clearTimeout(this.handler);
			}
		};

		this.update = function(percent){
			// arguments:
			//   percent: int [0, 100];
			this.progPrecent.css("width", percent + "%");
		};
	};
});