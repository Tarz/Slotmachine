cc.game.onStart = function() {
    
    cc.view.enableRetina(false);
    
    if (cc.sys.isNative) {
        var resolutionPolicy = (cc.sys.os == cc.sys.OS_WP8 || cc.sys.os == cc.sys.OS_WINRT) ? cc.ResolutionPolicy.SHOW_ALL : cc.ResolutionPolicy.FIXED_HEIGHT;
        cc.view.setDesignResolutionSize(g_scWidth, g_scHeight, resolutionPolicy);
        cc.view.resizeWithBrowserSize(true);
        
    }else
    {
        cc.view.setDesignResolutionSize(g_scWidth, g_scHeight, cc.ResolutionPolicy.SHOW_ALL);
        cc.view.resizeWithBrowserSize(true);
    }
    
    //Custom preloader 
    SlotMachinePreloader.preload(g_resources, function () {
        cc.director.runScene(new SlotMachineScene());
    });

    /*
        WHEN SLOTMACHINE'S BROWSER TAB IS INACTIVE, PAUSE GAME
     */ 
    // Adapted slightly from Sam Dutton
    var hidden, state, visibilityChange; 
    if (typeof document.hidden !== "undefined") {
        hidden = "hidden";
        visibilityChange = "visibilitychange";
        state = "visibilityState";
    } else if (typeof document.mozHidden !== "undefined") {
        hidden = "mozHidden";
        visibilityChange = "mozvisibilitychange";
        state = "mozVisibilityState";
    } else if (typeof document.msHidden !== "undefined") {
        hidden = "msHidden";
        visibilityChange = "msvisibilitychange";
        state = "msVisibilityState";
    } else if (typeof document.webkitHidden !== "undefined") {
        hidden = "webkitHidden";
        visibilityChange = "webkitvisibilitychange";
        state = "webkitVisibilityState";
    }
    
    document.addEventListener(visibilityChange, function() {
        
        if(document[state] == "hidden"){
            cc.director.pause();
        } else {
            cc.director.resume();
        }
        
    }, false);
};

cc.game.run();




