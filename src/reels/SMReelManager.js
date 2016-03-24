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

        var reelManager = this;
        
        cc.loader.loadJson("res/results.json", function(error,data){
        
            if(error) {
                console.log(error.errorMessage);
            } else {
                reelManager.addListeners();
                reelManager.createReels(data["machine-state"]);
            }
        });

        
    },

    addListeners: function() {
        cc.eventManager.addCustomListener("reel_has_spinned", this.listenReels.bind(this));
        cc.eventManager.addCustomListener("button_has_pressed", this.startAnimation.bind(this));
    },

    createReels: function(data) {
        
        var reel;
        
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

    /* EVENTLISTENERS */
    
    // Reel animation has suspended
    listenReels: function(event) {

        this.reelsStopped++;

        if(this.reelsStopped == this.reelsCount) {
            
            cc.eventManager.dispatchCustomEvent("all_reels_are_spinned", event.getUserData());
        }
    },
    
    // Starting reels animation
    startAnimation: function() {
        
        this.reelsStopped = 0;
        
        for (var i = 0; i < this.reelsCount; i++) {
            this.reels[i].startMainAnimation(this.animationTime + (i * this.animationTime));
        }
    }
});

