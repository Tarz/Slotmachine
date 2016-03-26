/* MAIN SCENE */

var SlotMachineScene = cc.Scene.extend({

    onEnter: function() {

        this._super();

        cc.spriteFrameCache.addSpriteFrames(res.sheet_plist, res.sheet_png);
        
        // BACKGROUND
        var backgroundLayer = new SMBackgroundLayer();
        backgroundLayer.init();
        this.addChild(backgroundLayer);
        backgroundLayer.bake();

        // REELS
        var reelManager = new SMReelManager();
        reelManager.init(this);
        this.addChild(reelManager);


        //HUD
        this.hudLayer = new SMHudLayer();
        this.hudLayer.init(this);
        this.addChild(this.hudLayer);
        this.hudLayer.bake();
    }
});
