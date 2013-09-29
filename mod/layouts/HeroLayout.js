define(["text!./HeroLayout.html", "./HeroStatusBar", "link!./HeroLayout.css"], function(sHTML, HeroStatusBar){

	return function(){


		var _heroLayout_on_update_handler = function(evt){
			labels[evt.type].text(evt.newVal);
		};

		this.setup = function(args){
		    // native:
		    this.CPDelta = 0;
		    this.STRDelta = 0;
		    this.VITDelta = 0;
		    this.INTDelta = 0;
		    this.LUKDelta = 0;
		    this.hasDashBoard = true;
		    
			this.hero = args.hero;
			this.domNode = $(sHTML);

			this._init_dom(this.domNode);
			this._init_hero_val(this.hero);
            
            this._init_hero_status_listeners(this.hero);
            this._init_upgrade_status_listeners();
            this.showUpdateButtons();

			this.domNode.appendTo(args.domNode);
		};

		this._init_dom = function(domNode){
			this.lblNAME = domNode.find(".lbl_NAME");

			this._init_reg_LV(domNode.find(".reg_LV"));
			this._init_reg_HP(domNode.find(".reg_HP"));

			this.lblATKMIN = domNode.find(".lbl_ATKMIN");
			this.lblATKMAX = domNode.find(".lbl_ATKMAX");
			this.lblDEF = domNode.find(".lbl_DEF");
			this.lblGOLD = domNode.find(".lbl_GOLD");
			this.lblCP = domNode.find(".lbl_CP");
			this.lblSP = domNode.find(".lbl_SP");
			this.lblSTR = domNode.find(".lbl_STR");
			this.lblVIT = domNode.find(".lbl_VIT");
			this.lblINT = domNode.find(".lbl_INT");
			this.lblLUK = domNode.find(".lbl_LUK");

			this.lblSTRA = domNode.find(".lbl_STR_A");
			this.lblVITA = domNode.find(".lbl_VIT_A");
			this.lblINTA = domNode.find(".lbl_INT_A");
			this.lblLUKA = domNode.find(".lbl_LUK_A");

			this.btnAddSTR = domNode.find(".btn_add_STR");
			this.btnAddVIT = domNode.find(".btn_add_VIT");
			this.btnAddINT = domNode.find(".btn_add_INT");
			this.btnAddLUK = domNode.find(".btn_add_LUK");
			this.regDashboard = domNode.find(".reg_dashboard");
			this.btnUpgrade = domNode.find(".btn_upgrade");
			this.btnCancel = domNode.find(".btn_cancel");
		};

		this._init_hero_val = function(hero){
			this.lblNAME.text(hero.name);
			
            this.setlbl("LV");
            this.setEXP();

            this.setHP();

			this.setATKMIN();
			this.setATKMAX();

			this.setDEF();

			this.setlbl("GOLD");

            this.setCP();
            this.setlbl("SP");

			this.setlbl("STR");
			this.setlbl("VIT");
			this.setlbl("INT");
			this.setlbl("LUK");
		};
		
		this.setlbl = function(attrName){
            this["lbl" + attrName].text(this.hero[attrName]());
        };
		
		this.setEXP = function(){
		    var CEXP = this.hero.CEXP(),
		          MEXP = this.hero.MEXP();
		    this.lblNEXP.text(MEXP - CEXP);
		    this.lvStatusBar.update(parseInt(100 * CEXP / MEXP));
		};
		
		this.setHP = function(){
		    var CHP = this.hero.CHP(),
		          MHP = this.hero.MHP();
		    this.lblHP.text(CHP);
            this.hpStatusBar.update(parseInt(100 * CHP / MHP));
		};
		
		this.setATKMIN = function(){
		    this.lblATKMIN.text(this.hero.ATKMIN().toFixed(2));
		};
		
		this.setATKMAX = function(){
		    this.lblATKMAX.text(this.hero.ATKMAX().toFixed(2));
		};

		this.setDEF = function(){
		    this.lblDEF.text(parseInt(this.hero.DEF()));
		};
		
		this.setCP = function(){
		    this.lblCP.text(this.hero.CP() + this.CPDelta);
		};
		
		this._init_reg_LV = function(regLV, hero){
			var domNode = $('<div><label>Lv</label><span class="lbl_LV"></span> (next: <span class="lbl_NEXP"></span>)</div>');
			this.lblLV = domNode.find(".lbl_LV");
			this.lblNEXP = domNode.find(".lbl_NEXP");

			this.lvStatusBar = new HeroStatusBar();
			this.lvStatusBar.setup({
				domNode: regLV,
				label: domNode
			});
		};

		this._init_reg_HP = function(regHP){
			var domNode = $('<div><label>HP</label> <span class="lbl_HP"></span></div>');
			this.lblHP = domNode.find(".lbl_HP");

			this.hpStatusBar = new HeroStatusBar();
			this.hpStatusBar.setup({
				domNode: regHP,
				label: domNode
			});
		};
		
		this._init_hero_status_listeners = function(eventEmitter){
		    var self = this;
		    eventEmitter.on("update_status", function(types, oldVal, newVal){
		        for(var i = types.length - 1; i > -1; --i){
		            switch(types[i]){
		                case "LV": self.setlbl("LV"); self.showUpdateButtons(); break;
		                case "CEXP": self.setEXP(); break;
		                case "MEXP": self.setEXP(); break;
		                case "CHP": self.setHP(); break;
		                case "MHP": self.setHP(); break;
		                case "CP": self.setCP(); break;
		                case "SP": self.setlbl("SP"); break;
		                case "GOLD": self.setlbl("GOLD"); break;
		                
		                case "ATKMIN": self.setATKMIN(); break;
		                case "ATKMAX": self.setATKMAX(); break;
		                case "DEF": self.setDEF(); break;
		                case "STR": self.setlbl("STR"); break;
		                case "VIT": self.setlbl("VIT"); break;
		                case "INT": self.setlbl("INT"); break;
		                case "LUK": self.setlbl("LUK"); break;
		            }
		        }
		    });
		};
		
		this._init_upgrade_status_listeners = function(){
		    var self = this;
		    // FIXME: ugly... merge into a single Listener;
		    this.btnAddSTR.click(function(){
		        var cost = self.hero._getUpdateCost(self.hero.STR() + self.STRDelta);
		        self.CPDelta -= cost;
		        self.setCP();
		        self.lblSTRA.text("(+" + (++self.STRDelta) +")");
		        self.showUpdateButtons();
		    });
		    this.btnAddVIT.click(function(){
                var cost = self.hero._getUpdateCost(self.hero.VIT() + self.VITDelta);
                self.CPDelta -= cost;
                self.setCP();
                self.lblVITA.text("(+" + (++self.VITDelta) +")");
                self.showUpdateButtons();
            });
            this.btnAddINT.click(function(){
                var cost = self.hero._getUpdateCost(self.hero.INT() + self.INTDelta);
                self.CPDelta -= cost;
                self.setCP();
                self.lblINTA.text("(+" + (++self.INTDelta) +")");
                self.showUpdateButtons();
            });
            this.btnAddLUK.click(function(){
                var cost = self.hero._getUpdateCost(self.hero.LUK() + self.LUKDelta);
                self.CPDelta -= cost;
                self.setCP();
                self.lblLUKA.text("(+" + (++self.LUKDelta) +")");
                self.showUpdateButtons();
            });
            
            this.btnUpgrade.click(function(){
                if(self.STRDelta > 0){
                    self.hero.STR(self.STRDelta, true);
                    self.STRDelta = 0;
                    self.lblSTRA.text("");
                }
                if(self.VITDelta > 0){
                    self.hero.VIT(self.VITDelta, true);
                    self.VITDelta = 0;
                    self.lblVITA.text("");
                }
                if(self.INTDelta > 0){
                    self.hero.INT(self.INTDelta, true);
                    self.INTDelta = 0;
                    self.lblINTA.text("");
                }
                if(self.LUKDelta > 0){
                    self.hero.LUK(self.LUKDelta, true);
                    self.LUKDelta = 0;
                    self.lblLUKA.text("");
                }
                var tmpCP = self.CPDelta;
                self.CPDelta = 0;
                self.hero.CP(tmpCP, true);
                self.showUpdateButtons();
            });
            
            this.btnCancel.click(function(){
                self.STRDelta = self.VITDelta = self.INTDelta = self.LUKDelta = self.CPDelta = 0;
                self.lblSTRA.text("");
                self.lblVITA.text("");
                self.lblINTA.text("");
                self.lblLUKA.text("");
                self.setCP();
                self.showUpdateButtons();
            });
		};
		
		this.showUpdateButtons = function(){
		    var hero = this.hero,
		          numCP = hero.CP() + this.CPDelta,
		          getCost = hero._getUpdateCost,
		          isShowSTR = numCP > getCost(hero.STR() + this.STRDelta),
		          isShowVIT = numCP > getCost(hero.VIT() + this.VITDelta),
		          isShowINT = numCP > getCost(hero.INT() + this.INTDelta),
		          isShowLUK = numCP > getCost(hero.LUK() + this.LUKDelta);
		    this.btnAddSTR.css("display", isShowSTR ? "inline" : "none");
            this.btnAddVIT.css("display", isShowVIT ? "inline" : "none");
            this.btnAddINT.css("display", isShowINT ? "inline" : "none");
            this.btnAddLUK.css("display", isShowLUK ? "inline" : "none");
            
            var isShowDashboard = this.STRDelta > 0 || this.VITDelta > 0 || this.INTDelta > 0 || this.LUKDelta > 0;
            if(isShowDashboard != this.hasDashBoard){
                this.regDashboard.css("display", (this.hasDashBoard = isShowDashboard) ? "block" : "none");
            }
		};

		this.destroy = function(){
			this.hero.off("update", _heroLayout_on_update_handler);
			this.hero = this.domNode = null;
		};
	};
});