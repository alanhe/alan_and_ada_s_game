define(["text!./MonsterLayout.html",
	"../data/adaList",
	"./StatusBar",
	"require",
"link!./MonsterLayout.css"], function(sHTML, adaList, StatusBar, require){

	return function(){
		var self = this;
		// self.domNode;
		// self.hpBar
		// self.ada
		var _monsterLayout_on_update_handler = function(types, oldVal, newVal){
			for(var i = types.length - 1; i > -1; --i){
				if("CHP" === types[i]){
					self.hpBar.update(self.ada.CHP(), self.ada.MHP());
				}
			}

		};

		this.setup = function(args){
			// args:
			//	domNode
			//	ada

			this.ada = args.ada;

			this.domNode = $(sHTML);
			this.domNode.find(".monsterName").text(this.ada.name);

			this.hpBar = new StatusBar();
			this.hpBar.setup({
				domNode: this.domNode.find(".monsterHP"),
				cssHeight: "5px"
			});
			self.hpBar.update(this.ada.CHP(), this.ada.MHP());

			this.domNode.find(".monsterImage").attr("src", require.toUrl(this.ada.picURL));

			this.domNode.find(".lbl_lv").text(this.ada.LV());
			var ulTitles = this.domNode.find(".monsterTitles");
			for(var i = 0; i < this.ada.titles.length; ++i){
				ulTitles.append("<li>" + this.ada.titles[i] + "</li>");
			}
			this.domNode.appendTo(args.domNode);

			this.ada.on("update_status", _monsterLayout_on_update_handler);
		};

		this.destroy = function(){
			this.ada.off("update_status", _monsterLayout_on_update_handler);
			this.domNode.remove();
		};
	};
});