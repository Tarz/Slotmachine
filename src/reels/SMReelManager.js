/* SMREELMANAGER */

var SMReelManager = cc.Layer.extend({

    init: function(scene) {
        
        this._super();
        
        this.scene = scene;
        this.reels = [];        // collect reels

        //REEL GEOMETRY
        var reelBgWidth = g_reelBgWidth;
        // w
        this.reelBgHalfW = reelBgWidth * .5;
        // h
        this.reelBgHeight = g_reelBgHeight;
        this.reelBgHalfH = this.reelBgHeight * .5;
        // x
        this.reelFirstXPos = g_reelFirstXPos;
        // y
        this.reelsYPos = g_reelsYPos;
        // x space
        this.reelsXSpace = g_reelsXSpace;
        
        
        this.animationTime = g_reelsAnimationTime;
        
        this.reelsCount = g_reelsCount;             // how many reels in scene

        this.reelsStopped = 0;                      // count reels whos animation has suspended

        var that = this;
        cc.loader.loadJson("res/results.json", function(error,data){
        
            if(error) {
                console.log(error.errorMessage);
            } else {
                that.createReels(data["machine-state"]);
            }
        });

        
    },

    createReels: function(data) {
        
        var reel;
        
        cc.eventManager.addCustomListener("reel_has_spinned", this.listenReels.bind(this));
        
        for (var i = 0; i < this.reelsCount; i++) {
            
            reel = new SMReel(i, data);
            
            reel.setPosition(
                            
                            this.reelBgHalfW + this.reelFirstXPos + (i * this.reelsXSpace), 
                            g_scHeight - this.reelBgHalfH - this.reelsYPos

                            );
            
            this.addChild(reel);
            
            // collect reel
            this.reels.push(reel);
        }
    },

    // Listen reel animation has suspended
    listenReels: function(event) {

        this.reelsStopped++;

        if(this.reelsStopped == this.reelsCount) {
            
            this.activateCounter(event.getUserData());
        }
    },

    // Count win amount
    activateCounter: function(winAmount) {

        this.scene.activateCounter(winAmount);
    },

    // Starting reels animation
    startAnimation: function() {
        
        this.reelsStopped = 0;
        
        for (var i = 0; i < this.reelsCount; i++) {
            this.reels[i].startMainAnimation(this.animationTime + (i * this.animationTime));
        }
    }
});

