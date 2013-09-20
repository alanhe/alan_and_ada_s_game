define(["./BaseScene", "text!./SCMain.html",
	"../layouts/HeroLayout", "../layouts/LogBox", "../FightManager",
	"link!./SCMain.css"], function(BaseScene, sHTML, HeroLayout, LogBox, FightManager){
    return function(){
        $.extend(this, new BaseScene());

        var self = this;
        // self.hero;

        // self.btnInventory;
        // self.btnSkills;
        // self.btnTeam;
        // self.btnMap;
        // self.btnSave;
        // self.btnExit;
        // self.heroLayout;
        // self.logBox;

        this.enter = function(bundle){
        	self.hero = bundle.hero;
            this.buildScene();

            this.testFight();
        };

        this.testFight = function(){
        	FightManager.on("msg_atk_new_enemies", function(enermies){
				for(var i = 0; i < enermies.length; ++i){
					self.logBox.log(enermies[i].name, function(str){
						return "<li>" + str  + "</li>";
					});
				}
			});
			FightManager.on("msg_atk_gen_damages", function(args){
				self.logBox.log(args, function(args){
					return "<li>"
						+ "<strong>" + args.fromName + "</strong> cast " + args.skillName
						+ " to <strong>" + (typeof args.toName == "string" ? args.toName : "All")+ "</strong>"
						+ ", cause " + args.damages + " damage points</li>";
				});
			});
			FightManager.newFight({
				party1: [self.hero],
				callback: function(){
					self.logBox.log("Defeat enermies! fight end.");
				},
				failback: function(){
					self.logBox.log("Hero died!");
				}
			});
        };

        this.leave = function(){
            this.destroyScene();
        };

        this.buildScene = function(){
            var domNode = $(sHTML);

			self.btnInventory = domNode.find("#btn_inventory");
			self.btnSkills = domNode.find("#btn_skills");
			self.btnTeam = domNode.find("#btn_team");
			self.btnMap = domNode.find("#btn_map");
			self.btnSave = domNode.find("#btn_save");
			self.btnExit = domNode.find("#btn_exit");

            self.heroLayout = new HeroLayout();
            self.heroLayout.setup({domNode: domNode.find("#panel2_a"), hero: self.hero});

            self.logBox = new LogBox();
            self.logBox.setup({domNode: domNode.find("#panel4_b")});
            self.logBox.log("Welcome!");

            $("body").html(domNode);
        };

        this.destroyScene = function(){
            $("body").empty();
        };
    };
});