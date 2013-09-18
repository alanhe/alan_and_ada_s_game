define(["./BaseScene", "text!./SCIndex.html", "link!./SCIndex.css"], function(BaseScene, sHTML){
    return function(){
        $.extend(this, new BaseScene());
        
        var self = this;
        
        this.btnNew = null;
        this.btnLoad = null;
        
        this.enter = function(){
            this.buildScene();
            
            this.btnNew.click(function(){
                self.emit("mv_create_character");
            });
        };
        
        this.leave = function(){
            this.destroyScene();
        };
        
        this.buildScene = function(){
            var domNode = $(sHTML);
            this.btnNew = domNode.find("#btn_new");
            this.btnLoad = domNode.find("#btn_load");
            $("body").html(domNode);
        };
        
        this.destroyScene = function(){
            $("body").empty();
        };
    };
});