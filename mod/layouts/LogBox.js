define(["text!./LogBox.html", "link!./LogBox.css"], function(sHTML){
	return function(){

		this.numDisplay = 20;
		this.numMessage = 0;

		this.setup = function(args){
			// args:
			//    domNode
			this.domNode = $(sHTML);
			this.domNode.appendTo(args.domNode);
		};

		this.destroy = function(){
			this.domNode.remove();
		};

		this.log = function(bundle, Formatter){
			var domNode = null;
			if($.isFunction(Formatter)){
				Formatter(domNode = $("<li />"), bundle);
			} else {
				domNode = $("<li>" + bundle + "</li>");
			}
			if(this.numMessage < this.numDisplay){
				++this.numMessage;
			} else {
				this.domNode.children().first().remove();
			}
			this.domNode.append(domNode);
		};
	};
});