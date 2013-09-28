define(["text!./HeroLayout.html", "./HeroStatusBar", "link!./HeroLayout.css"], function(sHTML, HeroStatusBar){

	return function(){


		var _heroLayout_on_update_handler = function(evt){
			labels[evt.type].text(evt.newVal);
		};

		this.setup = function(args){
			this.hero = args.hero;
			this.domNode = $(sHTML);

			this._init_dom(this.domNode);
			this._init_hero_val(this.hero);



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
			this.btnUpgrade = domNode.find(".btn_upgrade");
			this.btnCancel = domNode.find(".btn_cancel");
		};

		this._init_hero_val = function(hero){
			this.lblNAME.text(hero.name);

			this.lblLV.text(hero.aLV);

			this.lblNEXP.text(parseInt(hero.MEXP() - hero.CEXP()));
			this.lvStatusBar.update(parseInt(100 * hero.CEXP() / hero.MEXP()));

			this.lblHP.text(hero.CHP());
			this.hpStatusBar.update(parseInt(100 * hero.CHP() / hero.MHP()));


			this.lblATKMIN.text(hero.ATKMIN().toFixed(2));

			this.lblATKMAX.text(hero.ATKMAX().toFixed(2));

			this.lblDEF.text(parseInt(hero.DEF()));

			this.lblGOLD.text(hero.GOLD());

			this.lblCP.text(hero.CP());

			this.lblSP.text(hero.SP());

			this.lblSTR.text(hero.attr("STR"));
			this.lblVIT.text(hero.attr("VIT"));
			this.lblINT.text(hero.attr("INT"));
			this.lblLUK.text(hero.attr("LUK"));
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

		this.destroy = function(){
			this.hero.off("update", _heroLayout_on_update_handler);
			this.hero = this.domNode = null;
		};
	};
});