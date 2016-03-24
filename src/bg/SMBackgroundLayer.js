/* SMBACKGROUNDLAYER */


var SMBackgroundLayer = cc.Layer.extend({

    init: function() {

        this._super();

        this.rows = g_bgRows;
        this.cols = g_bgColumns;
        this.bgTileSize = g_bgSize;
        this.bgHalf = this.bgTileSize * .5;
        this.create();
    },

    create: function() {

        var bgTile;
        
        for (var i = 0; i <this.rows*this.cols; i++) {

            bgTile = cc.Sprite.create(preloaderRes.bg_png);
            
            var xpos = this.bgHalf + ((i % this.cols) * this.bgTileSize);
            var ypos = (g_scHeight - this.bgHalf) - (Math.floor(i / (this.rows + 1)) * this.bgTileSize);
            
            bgTile.setPosition(xpos, ypos);
            this.addChild(bgTile);
        
        }
    }


});