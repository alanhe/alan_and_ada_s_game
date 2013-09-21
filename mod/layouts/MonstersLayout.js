define(["text!./MonstersLayout.html",
	"./MonsterLayout",
"link!./MonstersLayout.css"], function(sHTML, MonsterLayout){
	return function(){
		var self = this;

		this.monsterLayouts = [];


		this.setup = function(args){
			// args:
			//	domNode

			this.domNode = $(sHTML);
			this.domNode.appendTo(args.domNode);
		};

		this.addMonsters = function(args){
			var monsters = args.monsters;
			for(var i = 0; i < monsters.length; ++i){
				var monsterLayout = new MonsterLayout();
				monsterLayout.setup({
					domNode: this.domNode,
					ada: monsters[i]
				});
				this.monsterLayouts.push(monsterLayout);
			}
		};

		this.destroy = function(){
			for(var i = this.monsterLayouts.length - 1; i > -1; --i){
				this.monsterLayouts[i].destroy();
			}
			this.domNode.remove();
		};
	};
});