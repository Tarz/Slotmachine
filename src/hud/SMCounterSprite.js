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
        
        this.createBg();
        this.createCounter();
    },

    createBg: function() {

        var bg = cc.Sprite.create(res.counter_png);
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

    startCounting: function(winAmount) {
        
        if(winAmount == 0) {
            
            cc.eventManager.dispatchCustomEvent("counter_has_updated");
            return;
        }
        
        this.winAmount = winAmount;
        this.score = 0;
        this.addAmount = Math.round(winAmount * cc.director.getAnimationInterval()); // calculate add amount..
                                                                                     // ..Animation duration should not be exeeding 1 second. 
        this.schedule(this.animate, 0, cc.kCCRepeatForever, 0);

        cc.audioEngine.playEffect(res.coins_sfx, true);
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

    reset: function() {
        
        this.updateCounter(0);
    } 

});