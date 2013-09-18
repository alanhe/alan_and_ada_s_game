define(["./SCIndex", "./SCCreateCharacter"], function(SCIndex, SCCreateCharacter){
    // Map<"Message", sceneLeave, sceneEntry>;
    // sceneA.emit("leave_message") -> sceneA.leave() -> sceneB.enter();
    
    return function(){
        var self = this;
        
        var scIndex = new SCIndex();
        scIndex._id = "SCIndex";
        scIndex.on("mv_create_character", function(){
            scIndex.leave();
            self.scenes["SCCreateCharacter"].enter();
        });
        
        var scCreateCharacter = new SCCreateCharacter();
        scCreateCharacter._id = "SCCreateCharacter";
        scCreateCharacter.on("mv_main_scene", function(bundle){
            scCreateCharacter.leave();
            //console.debug(bundle.hero.name);
            //self.scenes["SCMain"].enter(bundle);
        });
        
        this.scenes = {
            SCIndex: scIndex,
            SCCreateCharacter: scCreateCharacter
        };
        this.currentScene = null;
        
        this.setScene = function(senceName){
            if(this.currentScene != null){
                this.currentScene.leave();
            }
            this.currentScene = this.scenes[senceName];
            this.currentScene.enter();
        };
    };
});