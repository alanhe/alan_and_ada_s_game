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
		var _monsterLayout_on_update_handler = function(evt){
			self.hpBar.update(parseInt(evt.newVal / self.ada.m_hp.getValue() * 100));
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
			this.hpBar.update(100);

			this.domNode.find(".monsterImage").attr("src", require.toUrl(this.ada.picURL));

			this.domNode.find(".lbl_lv").text(this.ada.lv);
			var ulTitles = this.domNode.find(".monsterTitles");
			for(var i = 0; i < this.ada.titles.length; ++i){
				ulTitles.append("<li>" + this.ada.titles[i] + "</li>");
			}
			this.domNode.appendTo(args.domNode);

			this.ada.on("update", _monsterLayout_on_update_handler);
		};

		this.destroy = function(){
			this.ada.off("update", _monsterLayout_on_update_handler);
			this.domNode.remove();
		};
	};
});