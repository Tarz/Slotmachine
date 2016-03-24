/* PRELOADER SCENE */

var SlotMachinePreloader = cc.Scene.extend({

	ctor: function() {
		
		this._super();
		this.countVisuals = 0;
	},

    init: function() {
    	
    	this.mainLayer = cc.Layer.create();
        this.addChild(this.mainLayer, 0);

        var preloader = this;
    	
    	// BACKGROUND
    	cc.loader.loadImg(preloaderRes.bg_png, {isCrossOrigin : false }, function(err, img){
    		
    		preloader.backgroundLayer = new SMBackgroundLayer();
        	preloader.backgroundLayer.init();
        	preloader.mainLayer.addChild(preloader.backgroundLayer, 1);
        	
        	preloader.countVisuals++;
        });
        
        // PROGRESSBAR BG
        cc.loader.loadImg(preloaderRes.progBg_png, {isCrossOrigin : false }, function(err, img) {
        	
        	preloader.progressBg = cc.Sprite.create(img);
       		preloader.progressBg.setPosition(g_scWidth * .5,g_scHeight * .5);
        	preloader.mainLayer.addChild(preloader.progressBg, 2);
        	
        	preloader.countVisuals++;
        });

        // PROGRESSBAR
        cc.loader.loadImg(preloaderRes.prog_png, {isCrossOrigin : false }, function(err, img) {
        	
        	preloader.progressBar = cc.Sprite.create(img);
        	preloader.progressBar.anchorX = 0;
       		preloader.progressBar.setPosition(g_scWidth * .5 - 480 * .5, g_scHeight * .5);
       		preloader.progressBar.scaleX = 0;
        	preloader.mainLayer.addChild(preloader.progressBar, 3);

        	 // PERCENT
        	preloader.counter = cc.LabelTTF.create("0%", "Arial Black", "80");
        	preloader.counter.setColor(new cc.Color(255,204,0))
        	preloader.counter.setPosition(g_scWidth * .5,g_scHeight * .5 - 90);
        	preloader.mainLayer.addChild(preloader.counter, 4);
        	
        	preloader.countVisuals++;
        });
    },

    onEnter: function() {
    	
    	this._super();
    	this.init(); //load and render preloader
      	this.schedule(this.waitVisuals);
    },

    waitVisuals: function(dt) {
    	
    	if(this.countVisuals === 3) {
    		
            this.unschedule(this.waitVisuals);
    		this.startLoading();
    	}
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
        	
            // Little delay to show 100% visuals
            preloader.schedule(preloader.preloaded, .30, 1, 0);
            
        });
    }, 

    initWithResources: function (resources, cb) {
        
        if(typeof resources == "string") resources = [resources];
        this.resources = resources || [];
		this.cb = cb;
	},

    preloaded: function() {
        
        this.unschedule(this.preloaded);
    	this.cb();
    },

    onExit: function() {
    	
    	this._super();
    	
    	this.mainLayer.removeChild(this.counter);
    	delete this.counter;
    	
    	this.mainLayer.removeChild(this.progressBar);
    	delete this.progressBar;
    	cc.loader.release(preloaderRes.prog_png);
    	
    	this.mainLayer.removeChild(this.progressBg);
    	delete this.progressBg;
    	cc.loader.release(preloaderRes.progBg_png);
    	
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