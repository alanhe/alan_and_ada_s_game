define(["../EventEmitter"], function(EventEmitter){
    return function(){
        // _id : every Scene should have an _id attribute which is controlled by SceneManager.
        
        $.extend(this, new EventEmitter());
        
        this.enter = function(bundle){
            // Invoke when current window is set to this scene;
            // bundle - an object to pass global data in;
        };
        
        this.leave = function(bundle){
            // Invoke before leaving current scene;
            // bundle - an object to pass global data out;
        };
        
        this.buildScene = function(){
            // DOM constructor
        };
        
        this.destroyScene = function(){
            // DOM destructor
        };
        
    };
});
