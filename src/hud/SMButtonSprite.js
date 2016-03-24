/* SMBUTTONSPRITE */

var SMButton = cc.Sprite.extend({
    
    ctor: function() {
        
        this._super();
        
        this.initWithFile(res.button_png);
    },
    
    setMouseListener: function(reelManager, hud) {

        // listen counter (has updated)
        cc.eventManager.addCustomListener("counter_has_updated", this.resumeMouseListener.bind(this));

        var button = this;

        this.mouseListener =  cc.EventListener.create({
            
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            
            onTouchBegan: function(touch, event){
                
                var target = event.getCurrentTarget();
                var location = target.convertToNodeSpace(touch.getLocation());
                var targetSize = target.getContentSize();
                var targetRectangle = cc.rect(0, 0, targetSize.width, targetSize.height);
                
                if (cc.rectContainsPoint(targetRectangle, location)) {
                    
                    cc.eventManager.pauseTarget(button);
                    
                    hud.resetCounter();
                    reelManager.startAnimation();
                    button.setOpacity(g_buttonInactiveOpacity);
                }
                
            }
        
        });

       cc.eventManager.addListener(this.mouseListener, this);
    },

    resumeMouseListener: function() {
        this.setOpacity(255);
        cc.eventManager.resumeTarget(this);
    } 
});