define(["./BaseScene", "text!./SCMain.html", "../EventEmitter",
	"../layouts/HeroLayout", "../layouts/MonstersLayout", "../layouts/LogBox", "../FightManager",
	"link!./SCMain.css"], function(BaseScene, sHTML, EventEmitter, HeroLayout, MonstersLayout, LogBox, FightManager){


	var eventEmitter = new EventEmitter();

	eventEmitter.on("msg_atk_start", function(self){
		self.isFighting = true;
		self.newFight();
	});

	eventEmitter.on("msg_atk_interrupt", function(self){
		self.interruptFight();
		eventEmitter.emit("msg_atk_stop", self);
	});

	eventEmitter.on("msg_atk_stop", function(self){
		self.isFighting = false;
		self.btnFight.text("Fight");
	});

    return function(){
        $.extend(this, new BaseScene());

        var self = this;

        this.isFighting = false;
        // self.hero;

		// self.btnFight;
        // self.btnInventory;
        // self.btnSkills;
        // self.btnTeam;
        // self.btnMap;
        // self.btnSave;
        // self.btnExit;
        // self.heroLayout;
        // self.logBox;
        // self.monstersLayout;

        this.enter = function(bundle){
        	self.hero = bundle.hero;
            this.buildScene();

            this.setupMenus();

			this.setupFight();
        };

        this.setupMenus = function(){
			this.btnFight.click(function(){
				var message = $.trim(self.btnFight.text());
				self.btnFight.text(message === "Fight" ? "Flee" : "Fight");
				eventEmitter.emit(message === "Fight" ? "msg_atk_start" : "msg_atk_interrupt", self);
			});
        };

        this.setupFight = function(){
        	FightManager.on("msg_atk_new_enemies", function(enemies){
				for(var i = 0; i < enemies.length; ++i){
					self.logBox.log(enemies[i].name, function(str){
						return "<li><strong>" + str  + "</strong> jumps from nowhere!</li>";
					});
				}
				self.monstersLayout.addMonsters({monsters : enemies});
			});
			FightManager.on("msg_atk_gen_damages", function(args){
				self.logBox.log(args, function(args){
					return "<li>"
						+ "<strong>" + args.fromName + "</strong> cast " + args.skillName
						+ " to <strong>" + (typeof args.toName == "string" ? args.toName : "All")+ "</strong>"
						+ ", causing " + args.damages + " damage points.</li>";
				});
			});
			FightManager.on("msg_atk_interrupt", function(){
				self.logBox.log(self.hero.name + " fled from a terrible fight...");
			});
        };

        this.newFight = function(){
			FightManager.newFight({
				party1: [self.hero],
				callback: function(enemies){
					self.logBox.log("Defeat enermies! fight end.");
					self.monstersLayout.clear();
					var gainExp = 0,
						gainGold = 0;
					for(var i = 0; i < enemies.length; ++i){
						gainExp += enemies[i].exp;
						gainGold += enemies[i].gold;
					}
					self.hero.setAttribute("exp", self.hero.exp + gainExp);
					self.hero.setAttribute("gold", self.hero.gold + gainGold);

					eventEmitter.emit("msg_atk_stop", self);
				},
				failback: function(){
					self.logBox.log("Hero died!");

					eventEmitter.emit("msg_atk_stop", self);
				}
			});
        };

        this.interruptFight = function(){
			FightManager.interrupt();
			this.monstersLayout.clear();
        };

        this.leave = function(){
            this.destroyScene();
        };

        this.buildScene = function(){
            var domNode = $(sHTML);

			self.btnFight = domNode.find("#btn_fight");
			self.btnInventory = domNode.find("#btn_inventory");
			self.btnSkills = domNode.find("#btn_skills");
			self.btnTeam = domNode.find("#btn_team");
			self.btnMap = domNode.find("#btn_map");
			self.btnSave = domNode.find("#btn_save");
			self.btnExit = domNode.find("#btn_exit");

            self.heroLayout = new HeroLayout();
            self.heroLayout.setup({domNode: domNode.find("#panel2_a"), hero: self.hero});


            self.monstersLayout = new MonstersLayout();
            self.monstersLayout.setup({domNode: domNode.find("#panel3_c")});

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