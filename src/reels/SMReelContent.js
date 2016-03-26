/* SMREELCONTENT */

var SMReelContent = cc.Sprite.extend({
    
    ctor: function(index, data) {

        this._super();
        
        //console.log(cc.sys.capabilities)
        
        if(g_symbolCount < 9) {
            console.log("g_symbolCount must be at least 9");
            return;
        }

        this.index = index;
        
        //JSON DATA
        this.data = data;                       // data from json file                     
        this.spinCount = -1;                    // current position in json array
        this.maxSpinCount = this.data.length;   // json array length
        
        
        this.speed = g_reelSpeed;               // anim speed
        this.friction = 1;

        this.symbolCount = g_symbolCount;
        

        this.reelBgHeight = g_reelBgHeight;      // geom
        this.reelBgHeightH = this.reelBgHeight * .5;
        
        this.symbolHeight = g_symbolHeight;
        this.offset = g_reelsOffset;
        
        this.swapPosition = -this.reelBgHeightH-this.offset; // y position for swapping
        this.endPosition =  -this.symbolHeight;              // y position for end of animation. 
                                                             // This is third slot position. Used for checking conditions.. 
                                                             // ..to stop animation in right place (symbol.name = "stopSymbol").
        
        // translate keys from json file to spritesheet names
        this.symbolDictionary = {
            "H1": "h1.png",
            "H2": "h2.png",
            "H3": "h3.png",
            "H4": "h4.png",
            "L1": "l1.png",
            "L2": "l2.png",
            "L3": "l3.png",
            "L4": "l4.png",
            "WILD": "wild.png"
        }

        this.symbolDictKeys = Object.keys(this.symbolDictionary);   // symbolDictionary keys
        this.symbolNamesLength = this.symbolDictKeys.length;        // symbolDictionary length

        
        this.symbols = [];          // collect all sprites (default 20)
        this.displayList = [];      // collect visible sprites (4)

        this.isAnimation = true;    // allow or prohibit animation
        this.brake = false;         // if time is out then take prepare animation for stop
        
        this.nextSymbolIndex  = 3;  // get next symbol from this.symbols and unsift it to this.displayList
        
    },

    onEnter: function() {
        
        this._super();
        this.createContent();
        this.prepare();
    },

    init: function() {
    	
        // restore properties
        this.isAnimation = true;
   		this.brake = false; // If time is out then take last animation part 
        
        this.friction = 1;
        this.speed = g_reelSpeed;
        
        this.spinCount++;
        if(this.spinCount >= this.maxSpinCount) this.spinCount = 0;

        var symbolName;
        
        for(var i = 0, len = this.symbols.length; i<len; i++) {
            
            this.symbols[i].stopSymbol = false; // set "stopSymbol" to undefined

            // set all symbols to random  except visible symbols in displayList 
            if(this.displayList.indexOf(this.symbols[i]) == -1) {
                
                // get random symbol name
                symbolName = this.symbolDictionary[this.symbolDictKeys[randomMinMax(0, this.symbolNamesLength - 1)]];
                this.symbols[i].setDisplayFrame(cc.spriteFrameCache.getSpriteFrame(symbolName));  
            }
        }
        
        if(this.index == g_reelsCount-1) cc.audioEngine.playEffect(res.spin_sfx, true); // Last reel playis spin sound
    },
    
    createContent: function() {

        var symbolName;

        for (var i = 0, len = this.symbolCount; i < len; i++) {

            // get random symbol name
            symbolName = this.symbolDictionary[this.symbolDictKeys[randomMinMax(0, this.symbolNamesLength - 1)]];
            
            this.createSymbol(symbolName, i);
        }
    },
    
    createSymbol: function(symbolName, i) {
        
        // create sprite from random symbol name and add it to the reel
        var symbol = cc.Sprite.create(cc.spriteFrameCache.getSpriteFrame(symbolName));
        
        // hide symbol
        symbol.setVisible(false);
        this.addChild(symbol);
        
        // collect symbol 
        this.symbols.push(symbol);
    },
    
    // prepare displayList
    prepare: function() {
        
        for(var i = this.nextSymbolIndex; i>=0; i--) {

            // show symbol
            this.symbols[i].setPosition(0, this.reelBgHeightH - (i * this.symbolHeight) + this.offset);
            this.symbols[i].setVisible(true);
            this.displayList.push(this.symbols[i]);
        }
    },
    
    animate: function(dt) {

        if (!this.isAnimation) return;
        
        this.speed = Math.max(this.friction * this.speed, 100);
        
        var symbol, ypos, dtSpeed = this.speed * dt;
        
        for(var i = 0, len = this.displayList.length; i < len; i++) {
            
            symbol = this.displayList[i];
            
            ypos = symbol.y - dtSpeed;
            
            this.checkConditions(symbol, ypos);

            // when animation time is out and "stopSymbol" in displayList check it y position
            if(this.brake && symbol.stopSymbol) {
                
                if(ypos <= this.endPosition) {
                    
                    ypos = this.endPosition; 
                    this.stopAnimation();
                    this.align(i);
                    break;
                }
            } 

            symbol.y = ypos;
        }
    },

    // Infinite scroll
    checkConditions: function(symbol, ypos) {
    	
        // If symbol y is lower than endPosition, swap symbols
        if(ypos <= this.swapPosition) {

            // Remove current symbol
            
            symbol.setVisible(false);
            this.displayList.pop();
            
            // Decrementing index
            this.nextSymbolIndex--;        
            if(this.nextSymbolIndex < 0) {
                this.nextSymbolIndex = this.symbolCount - 1;
            }
            
            // Get next symbol
            var nextSymbol = this.symbols[this.nextSymbolIndex];
            
            // Add nextSymbol to display list
            this.displayList.unshift(nextSymbol);

            // Set position above to first symbol
            nextSymbol.setVisible(true);
            nextSymbol.y = this.displayList[1].y + this.symbolHeight;
            
        }   
    },

    // Align symbols after end of animation
    align: function(index) {
        
        for(var i = index; i >= 0; i--){
            this.displayList[i].y = this.endPosition + ((index-i) * this.symbolHeight);
        }
        for(var i = index + 1, len = this.displayList.length; i < len; i++){
            this.displayList[i].y = this.endPosition - ((index) * this.symbolHeight);
        }
    },
    
    addFriction: function() {
        this.friction = g_reelFriction;
    },

    brakeAnimation: function() {

        this.brake = true;
        this.addSymbolsBetween();
    },

    // add symbols for spin results
    addSymbolsBetween: function() {
        
        var resultSymbolArray = this.data[this.spinCount]["reels"][this.index];
        
        var index;
        
        index = this.getCorrectIndex(this.nextSymbolIndex - 3);
        this.symbols[index].setDisplayFrame(cc.spriteFrameCache.getSpriteFrame(this.symbolDictionary[resultSymbolArray[2]]));
        this.symbols[index].stopSymbol = true;
        
        index = this.getCorrectIndex(this.nextSymbolIndex - 4);
        this.symbols[index].setDisplayFrame(cc.spriteFrameCache.getSpriteFrame(this.symbolDictionary[resultSymbolArray[1]]));
        
        index = this.getCorrectIndex(this.nextSymbolIndex - 5);
        this.symbols[index].setDisplayFrame(cc.spriteFrameCache.getSpriteFrame(this.symbolDictionary[resultSymbolArray[0]]));
    },

    // helper method, infinite traversing in this.symbols
    getCorrectIndex: function(index) {

        if(index < 0 ) index = this.symbolCount + index;
        return index;
    },

    stopAnimation: function() {
    	
        this.isAnimation = false;
        
        cc.eventManager.dispatchCustomEvent("reel_has_spinned_" + this.index);
        
        // Stop all sfx's when this reel is last spinner
        if(this.index == g_reelsCount-1) cc.audioEngine.stopAllEffects();
        
        cc.audioEngine.playEffect(res.spinEnd_sfx, false);
        
        //wait when spinEnd sfx ends, then dispatch event to count win amount
        this.scheduleOnce( this.waitSoundEffectStops, .3 );
       
    },
    
    waitSoundEffectStops: function() {
        cc.eventManager.dispatchCustomEvent("reel_has_spinned", Number(this.data[this.spinCount]["win"]));
    }
});