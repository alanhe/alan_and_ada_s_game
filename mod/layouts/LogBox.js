define(["text!./LogBox.html", "link!./LogBox.css"], function(sHTML){

	var _add = function(widget, htmlMessage){
		widget.messages.push(htmlMessage);
		widget.domNode.prepend(htmlMessage);
		if(widget.messages.length > widget.numDisplay){
			widget.messages.shift();
			widget.domNode.children().last().remove();
		}
	};

	return function(){
		var self = this;
		// self.domNode;

		this.numDisplay = 20;
		this.messages = [];

		this.setup = function(args){
			this.domNode = $(sHTML);
			this.domNode.appendTo(args.domNode);
		};

		this.destroy = function(){
			this.domNode.remove();
			this.domNode = null;
			this.message.length = 0;
		};

		this.log = function(bundle, Formatter){
			var htmlMessage = $.isFunction(Formatter) ? Formatter(bundle) : "<li>" + bundle + "</li>";
			_add(this, htmlMessage);
		};
	};
});