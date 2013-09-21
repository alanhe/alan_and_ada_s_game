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

            this.btnRoll.click(function(){
                var val = 0;
                //HP:
                val = parseInt(1000 + Math.random()  * 49);
                self.hero.setAttribute("c_hp", val);
                self.hero.setAttribute("m_hp", val);
                //MP:
                val = parseInt(1 + Math.random()  * 49);
                self.hero.setAttribute("c_mp", val);
                self.hero.setAttribute("m_mp", val);
                //ATK:
                val = parseInt(1 + Math.random() * 14);
                self.hero.setAttribute("atk", val);
            });

            this.btnCreate.click(function(){
                //FIXME: Make sure Roll is called at least once:
                self.emit("mv_main_scene", {hero : self.hero});
            });

            this.txtName.blur(function(){
                //FIXME: validate input hero's name
                console.debug("blur is triggered");
                self.hero.setAttribute("name", $.trim(self.txtName.text()));
            });
        };

        this.leave = function(){
            this.destroyScene();
        };

        this.buildScene = function(){
            var domNode = $(sHTML);
            self.btnCreate = domNode.find("#btn_create");
            self.hero = new Alan();
            self.heroLayout = new HeroLayout();
            self.heroLayout.setup({domNode: domNode.find("#widget_character"), hero: self.hero});
            self.btnRoll = domNode.find("#btn_roll");
            self.txtName = domNode.find(".name");
            self.txtName.attr("contenteditable", true);
            self.txtName.attr("title", "Click to update hero's name.");
            $("body").html(domNode);
        };

        this.destroyScene = function(){
            $("body").empty();
        };
    };
});