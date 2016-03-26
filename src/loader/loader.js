/* PRELOADER SCENE */

var SlotMachinePreloader = cc.Scene.extend({

	 onEnter: function() {
        
        this._super();
        
        this.mainLayer = cc.Layer.create();
        this.addChild(this.mainLayer, 0);

        //load and render preloader

        var preloader = this;

        cc.loader.load(g_loaderResources, function() {}, function() {
            preloader.createSceneUI();
            preloader.startLoading();
        });
    },
    
    createSceneUI: function() {
        
        cc.spriteFrameCache.addSpriteFrames(preloaderRes.sheet_plist, preloaderRes.sheet_png);
        
        // BACKGROUND 
        this.backgroundLayer = new SMBackgroundLayer();
        this.backgroundLayer.init();
        this.mainLayer.addChild(this.backgroundLayer, 1);

        // PROGRESSBAR BG
        this.progressBg = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("progress_bg.png"));
        this.progressBg.setPosition(g_scWidth * .5,g_scHeight * .5);
        this.mainLayer.addChild(this.progressBg, 2);

        // PROGRESSBAR
        this.progressBar = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("progress_fill.png"));
        this.progressBar.anchorX = 0;
        this.progressBar.setPosition(g_scWidth * .5 - 480 * .5, g_scHeight * .5);
        this.progressBar.scaleX = 0;
        this.mainLayer.addChild(this.progressBar, 3);
        
        // PERCENT
        this.counter = cc.LabelTTF.create("0%", "Arial Black", "80");
        this.counter.setColor(new cc.Color(255,204,0))
        this.counter.setPosition(g_scWidth * .5,g_scHeight * .5 - 90);
        this.mainLayer.addChild(this.counter, 4);
    },
    
    startLoading: function () {
    	
    	var preloader = this;
    	
    	cc.loader.load(this.resources, function(result, count, loadedCount) {
        	
            var scale = loadedCount/count;
        	var percent = Math.round(scale*100);

        	preloader.progressBar.scaleX = scale;
        	preloader.counter.setString(percent + "%");
        
        }, function(){
        	
            preloader.counter.setString(100 + "%");
        	preloader.progressBar.scaleX = 1;
        	
            // Little delay to show "100%" visuals
            preloader.scheduleOnce( preloader.preloaded, .3 );
        });
    }, 

    initWithResources: function (resources, cb) {
        
        if(typeof resources == "string") resources = [resources];
        this.resources = resources || [];
		this.cb = cb;
	},

    // Add game scene
    preloaded: function() {
        this.cb();
    },

    // DESTROY
    onExit: function() {
    	
    	this._super();
    	
        cc.spriteFrameCache.removeSpriteFrames();
        cc.loader.release(preloaderRes.sheet_plist);
        cc.loader.release(preloaderRes.sheet_png);
    	
        this.mainLayer.removeChild(this.counter);
    	delete this.counter;
    	
    	this.mainLayer.removeChild(this.progressBar);
    	delete this.progressBar;
    	
    	
    	this.mainLayer.removeChild(this.progressBg);
    	delete this.progressBg;
    	
        this.mainLayer.removeChild(this.backgroundLayer);
    	delete this.backgroundLayer;
    	
    	this.removeChild(this.mainLayer);
    	delete this.mainLayer;
    }
});

SlotMachinePreloader.preload = function(resources, cb){
    
    var preloader = new SlotMachinePreloader();
    preloader.initWithResources(resources, cb);
	
	cc.director.runScene(preloader);

    return preloader;
};