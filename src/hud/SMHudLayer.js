/* SMHUDLAYER */


var SMHudLayer = cc.Layer.extend({
    
    init: function() {
        
        this._super();

        this.counter = null;
        this.button = null;

        this.createCounter();
        this.createButton();
    },

    // RENDER BUTTON
    createButton: function() {
        
        this.button = new SMButton();
        this.button.setPosition(g_buttonXpos, g_buttonYpos);
        this.addChild(this.button);
    },

    // RENDER COUNTER
    createCounter: function() {
        
        this.counter = new SMCounter();
        this.counter.setPosition(g_counterXpos, g_counterYpos);
        this.addChild(this.counter);
    },
});