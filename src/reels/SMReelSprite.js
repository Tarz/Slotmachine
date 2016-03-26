/* SMREELSPRITE */

var SMReel = cc.Node.extend({

    ctor: function(index, data) {

        this._super();
        
        this.index = index;                                     
        
        this.reelBgWidth = g_reelBgWidth;                       // reel white bg width
        this.reelBgHalfW = this.reelBgWidth * .5;

        this.reelBgHeight = g_reelBgHeight;                     // reel white bg height
        this.reelBgHalfH = this.reelBgHeight * .5;
        
        this.data = data;       // data from json file
        this.reel = null;       // reel content collected to cc.Sprite

        this.bg;
        this.reel;
        this.glass;
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

        this.bg = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("reelbg.png"));
        this.addChild(this.bg);
    },

    // CREATE REEL CONTENT WITH MASK
    createReelContentWithMask: function() {

        // create reel content
        this.reel = new SMReelContent(this.index, this.data);
        //this.addChild(this.reel);
        
        var white = cc.color(255, 255, 255, 255);
        var stencil = cc.DrawNode.create();
        stencil.drawRect(cc.p(-this.reelBgHalfW, -this.reelBgHalfH), cc.p(this.reelBgHalfW, this.reelBgHalfH), white, 1, white);
        
        // ClippingNode
        var maskedFill = new cc.ClippingNode.create();
        maskedFill.setStencil(stencil);
        
        // MaskedFill
        maskedFill.addChild(this.reel);
        this.addChild(maskedFill);
    },
    
    // CREATE REEL GLASS (upper sprite for reels UI)
    createGlass: function() {

        this.glass = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame("reel.png"));
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
        this.scheduleOnce( this.addReelFriction, seconds-1 );         // after seconds-1 add friction
        this.scheduleOnce( this.brakeMainAnimation, seconds );        // give a signal to reelContent to start the suspension  
    },

    // UPDATE REELCONTENT Y POSITION
    animateMain: function(dt) {
        
        this.reel.animate(dt);
    },
    
    // Slow down reel spin 1000ms before animation ends
    addReelFriction: function() {
        
        this.reel.addFriction();
    },

    // Start the suspension
    brakeMainAnimation: function() {
        
        this.reel.brakeAnimation();
    },

    // Reelcontent is suspended
    listenReel: function() {
        
        this.unscheduleAllCallbacks();
        cc.eventManager.removeCustomListeners("reel_has_spinned_" + this.index);
    }
});