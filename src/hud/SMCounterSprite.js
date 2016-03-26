/* SMCounter */

var SMCounter = cc.Sprite.extend({
    
    ctor: function() {

        this._super();
        
        this.counter = null;
        
        this.bgWidth = g_counterBgWidth;
        this.halfW = this.bgWidth * .5;
        
        var height = g_counterBgHeight;
        this.halfH = height * .5;

        this.winAmount = 0;
        this.score = 0;
        this.addAmount = 0;
    },

    onEnter: function() {

        this._super();
        
        this.addListeners();
        this.createBg();
        this.createCounter();
    },

    addListeners: function() {
        
        cc.eventManager.addCustomListener("all_reels_are_spinned", this.startCounting.bind(this));
        cc.eventManager.addCustomListener("button_has_pressed", this.reset.bind(this));
    },

    createBg: function() {

        var bg = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("counter.png"));
        bg.setPosition(this.halfW, this.halfH)
        this.addChild(bg);
    },

    createCounter: function() {
        
        this.counter = cc.LabelTTF.create("0", "Arial", "32", cc.TEXT_ALIGNMENT_RIGHT);
        this.setCounterPosition();
        this.addChild(this.counter);
    },

    updateCounter: function(score) {
        
        this.counter.setString(score);
        this.setCounterPosition();
    },

    setCounterPosition: function() {
        
        this.counter.setPosition(this.bgWidth - (this.counter.width * .5) - 10, this.halfH);
    },
    
    animate: function(dt) {
        
        this.score = Math.min(this.score + this.addAmount, this.winAmount);
        
        this.updateCounter(this.score);
        
        // end of counter animation
        if(this.score == this.winAmount) { 
             
             this.unscheduleAllCallbacks();
             cc.eventManager.dispatchCustomEvent("counter_has_updated");
             cc.audioEngine.stopAllEffects();
        }

    },

    /* EVENTLISTENERS */
    
    startCounting: function(event) {
        
        var winAmount = event.getUserData();

        if(winAmount == 0) {
            
            cc.eventManager.dispatchCustomEvent("counter_has_updated");
            return;
        }
        
        this.winAmount = winAmount;
        this.score = 0;
        this.addAmount = Math.round(winAmount * cc.director.getDeltaTime()); // calculate add amount..
                                                                            // ..Animation duration should not be exeeding 1 second. 
        this.schedule(this.animate, 0, cc.kCCRepeatForever, 0);

        cc.audioEngine.playEffect(res.coins_sfx, true);
    },

    reset: function(event) {
        
        this.updateCounter(0);
    } 

});