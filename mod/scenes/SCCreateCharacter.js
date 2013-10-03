define(["./BaseScene", "text!./SCCreateCharacter.html",
    "../roles/Alan", "../layouts/HeroLayout",
    "link!./SCCreateCharacter.css"], function(BaseScene, sHTML, Alan, HeroLayout){
    return function(){
        $.extend(this, new BaseScene());

        var self = this;
        //  self.hero;
        //  self.heroLayout;
        //  this.txtName = null;
        //  this.btnRoll = null;
        //  this.btnCreate = null;

        this.enter = function(){
            this.buildScene();

            this.btnCreate.click(function(){
                //FIXME: Make sure Roll is called at least once:
                self.hero.CHP(self.hero.MHP());
                self.emit("mv_main_scene", {hero : self.hero});
            });

            this.txtName.blur(function(){
                //FIXME: validate input hero's name
                self.hero.name = $.trim(self.txtName.text());
            });
        };

        this.leave = function(){
            this.destroyScene();
        };

        this.buildScene = function(){
            var domNode = $(sHTML);
            self.btnCreate = domNode.find("#btn_create");
            self.hero = new Alan();
            self.hero.CP(30);
            self.heroLayout = new HeroLayout();
            self.heroLayout.setup({domNode: domNode.find("#widget_character"), hero: self.hero});
            self.txtName = domNode.find(".lbl_NAME");
            self.txtName.attr("contenteditable", true);
            self.txtName.attr("title", "Click to update hero's name.");
            $("body").html(domNode);
        };

        this.destroyScene = function(){
            $("body").empty();
        };
    };
});