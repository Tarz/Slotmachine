/* SMREELSPRITE */

var SMReel = cc.Node.extend({

    ctor: function(index, data) {

        this._super();
        
        this.index = index;                                     
        
        var reelBgWidth = g_reelBgWidth;                       // reel white bg width
        this.reelBgHalfW = reelBgWidth * .5;

        this.reelBgHeight = g_reelBgHeight;                     // reel white bg height
        this.reelBgHalfH = this.reelBgHeight * .5;
        
        this.data = data;       // data from json file
        this.reel = null;       // reel content collected to cc.Sprite
    },

    onEnter: function() {

        this._super();
        this.createBg();
        this.createReelContentWithMask();
        this.createGlass();
    },

    /* 
        CREATE GRAPHICS
    */
    
    // CREATE REEL BACKGROUND
    createBg: function() {

        this.bg = cc.Sprite.create(res.reelbg_png);
        this.addChild(this.bg);
    },

    // CREATE REEL CONTENT WITH MASK
    createReelContentWithMask: function() {

        // create reel content
        this.reel = new SMReelContent(this.index, this.data);
        
        //Mask
        var mask = cc.DrawNode.create();
        mask.drawRect(cc.p(-this.reelBgHalfW, -this.reelBgHalfH), cc.p(this.reelBgHalfW, this.reelBgHalfH));
       
        // ClippingNode
        var maskedFill = new cc.ClippingNode(mask);
       
        // MaskedFill
        maskedFill.addChild(this.reel);
        this.addChild(maskedFill);
    },
    
    // CREATE REEL GLASS (upper sprite for reels UI)
    createGlass: function() {

        this.glass = cc.Sprite.create(res.reel_png);
        this.glass.setPosition(0, 0);
        this.addChild(this.glass);
    },

    /* 
        ANIMATE
    */
   
   // START REELCONTENT ANIMATION
   startMainAnimation: function(seconds) {
        
        if(this.reel) this.reel.init();
        
        cc.eventManager.addCustomListener("reel_has_spinned_" + this.index, this.listenReel.bind(this));
        
        this.schedule(this.animateMain, 0, cc.kCCRepeatForever, 0); // main animation
        this.schedule(this.addReelFriction, seconds-1, 1, 0);       // after seconds-1 add friction
        this.schedule(this.brakeMainAnimation, seconds, 1, 0);      // give a signal to reelContent to start the suspension
    },

    // UPDATE REELCONTENT Y POSITION
    animateMain: function(dt) {
        
        this.reel.animate(dt);
    },
    
    // Slow down reel spin 1000ms before animation ends
    addReelFriction: function() {
        
        this.unschedule(this.addReelFriction);
        this.reel.addFriction();
    },

    // Start the suspension
    brakeMainAnimation: function() {
        
        this.unschedule(this.brakeMainAnimations);
        this.reel.brakeAnimation();
    },

    // Reelcontent is suspended
    listenReel: function() {
        
        this.unscheduleAllCallbacks();
        cc.eventManager.removeCustomListeners("reel_has_spinned_" + this.index);
    }
});