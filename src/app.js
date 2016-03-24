/* MAIN SCENE */

var SlotMachineScene = cc.Scene.extend({

    onEnter: function() {

        this._super();
        
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

        // make the button became aware about SMReelManager
        this.hudLayer.addButtonListener(reelManager);
    },

    activateCounter: function(winAmount) {
        this.hudLayer.activateCounter(winAmount);
    }

});
