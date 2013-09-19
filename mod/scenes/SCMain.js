define(["./BaseScene", "text!./SCMain.html",
	"../layouts/HeroLayout",
	"link!./SCMain.css"], function(BaseScene, sHTML, HeroLayout){
    return function(){
        $.extend(this, new BaseScene());

        var self = this;
        // self.hero;

        // self.btnInventory;
        // self.btnSkills;
        // self.btnTeam;
        // self.btnMap;
        // self.btnSave;
        // self.heroLayout;

        this.enter = function(bundle){
        	self.hero = bundle.hero;
            this.buildScene();

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

            self.heroLayout = new HeroLayout();
            self.heroLayout.setup({domNode: domNode.find("#panel2_a"), hero: self.hero});

            $("body").html(domNode);
        };

        this.destroyScene = function(){
            $("body").empty();
        };
    };
});