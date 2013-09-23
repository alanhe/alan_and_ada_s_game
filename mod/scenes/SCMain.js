define(["./BaseScene", "text!./SCMain.html", "../EventEmitter",
	"../layouts/HeroLayout", "../layouts/MonstersLayout", "../layouts/LogBox", "../FightManager", "../AutoActions", "../layouts/ProgressBar",
	"link!./SCMain.css"], function(BaseScene, sHTML, EventEmitter, HeroLayout, MonstersLayout, LogBox, FightManager, AutoActions, ProgressBar){

	var setupFightManager = function(self){
		FightManager.on("atk_message_newEnemies", function(enemies){
			if(!enemies || !enemies.length){
				return;
			}
			self.logBox.log(enemies, function(domNode, enemies){

				var sMessage = "";
				if(enemies.length == 1){
					sMessage = "<strong>" + enemies[0].name + "</strong> jumps from nowhere!";
				} else {
					for(var i = 0, l = enemies.length - 3; i < l; ++i){
						sMessage += "<strong>" + enemies[i].name + "</strong>, ";
					}
					sMessage += "<strong>" + enemies[i].name + "</strong> and " + "<strong>" + enemies[i + 1].name + "</strong> jumps from nowhere!";
				}
				domNode.append(sMessage);
			});
			self.monstersLayout.clear();
			self.monstersLayout.addMonsters({monsters : enemies});
		});

		FightManager.on("atk_message_newDamages", function(args){
			var sMessage = "<strong>" + args.fromName + "</strong> cast " + args.skillName
					+ " to <strong>" + (typeof args.toName == "string" ? args.toName : "All") + "</strong>"
					+ ", causing " + args.damages + " damage points.";
			self.logBox.log(sMessage);
		});

		FightManager.on("atk_message_success", function(enemies){
			AutoActions.onGoingEvent = null;
			self.logBox.log("Defeat enermies! fight end.");

			var gainExp = 0,
				gainGold = 0;
			for(var i = 0; i < enemies.length; ++i){
				gainExp += enemies[i].exp;
				gainGold += enemies[i].gold;
			}

			self.hero.setAttribute("exp", self.hero.exp + gainExp);
			self.hero.setAttribute("gold", self.hero.gold + gainGold);
			AutoActions.drawEvent();
		});

		FightManager.on("atk_message_failure", function(){
			self.logBox.log("Hero died!");
			AutoActions.restoreStatus.start();
		});

		FightManager.on("atk_message_interrupt", function(){
			self.logBox.log(self.hero.name + " fled from a terrible fight...");
		});
	};

	var setupAutoActions = function(self){
		AutoActions.on("auto_message_interrupt", function(){
			self.btnFight.text("Quest");
		});

		AutoActions.restoreStatus.on("start", function(timeInMillis){
			AutoActions.onGoingEvent = AutoActions.restoreStatus;
			self.logBox.log(timeInMillis, function(domNode, timeInMillis){
				domNode.append("<span><strong>" + self.hero.name + "</strong> decide to have a rest...</span>");
				AutoActions.restoreStatus._progressBar = new ProgressBar();
				AutoActions.restoreStatus._progressBar.setup({
					domNode: domNode,
					timeInMills: timeInMillis
				});
			});
			AutoActions.restoreStatus._progressBar.start();
		});
		AutoActions.restoreStatus.on("finish", function(){
			AutoActions.onGoingEvent = null;
			self.hero.setAttribute("c_hp", self.hero.attr("m_hp").val());
			self.hero.setAttribute("c_mp", self.hero.attr("m_mp").val());
			self.logBox.log("<strong>" + self.hero.name + "</strong>: I'm alive~~~");
			delete AutoActions.search._progressBar;
			AutoActions.drawEvent();
		});
		AutoActions.restoreStatus.on("interrupt", function(){
			AutoActions.onGoingEvent = null;
		});

		AutoActions.search.on("start", function(timeInMillis){
			AutoActions.onGoingEvent = AutoActions.search;
			self.logBox.log(timeInMillis, function(domNode, timeInMillis){
				domNode.append("<span><strong>" + self.hero.name + "</strong> decides to look around...</span>");
				AutoActions.search._progressBar = new ProgressBar();
				AutoActions.search._progressBar.setup({
					domNode: domNode,
					timeInMills: timeInMillis
				});
			});
			AutoActions.search._progressBar.start();
		});
		AutoActions.search.on("finish", function(findings){
			AutoActions.onGoingEvent = null;
			self.logBox.log(self.hero.name + " may have found something. GIVE ME!");
			delete AutoActions.search._progressBar;
			AutoActions.drawEvent();
		});
		AutoActions.search.on("interrupt", function(){
			AutoActions.onGoingEvent = null;
			AutoActions.search._progressBar.interrupt();
			delete AutoActions.search._progressBar;
		});

		AutoActions.fight.on("start", function(){
			AutoActions.onGoingEvent = AutoActions.fight;
			FightManager.newFight({
				party1: [self.hero]
			});
		});
		AutoActions.fight.on("interrupt", function(){
			AutoActions.onGoingEvent = null;
			FightManager.interrupt();
		});
	};

	var teardownAutoActions = function(self){

	};

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

			setupFightManager(this);
			setupAutoActions(this);

            this.setupMenus();
        };

        this.setupMenus = function(){
			this.btnFight.click(function(){
				var toQuest = $.trim(self.btnFight.text()) === "Quest";
				self.btnFight.text(toQuest ? "Flee" : "Quest");
				if(toQuest){
					AutoActions.drawEvent();
				} else {
					AutoActions.interrupt();
				}
			});
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