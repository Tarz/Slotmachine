var preloaderRes = {
    bg_png: "res/gameplay/bg.png"
    ,progBg_png: "res/loader/progress_bg.png"
    ,prog_png: "res/loader/progress_fill.png"
}

var res = {
    sheet_plist: "res/symbols/sheet.plist"
    ,sheet_png: "res/symbols/sheet.png"
    ,button_png: "res/gameplay/button.png"
    , counter_png: "res/gameplay/counter.png"
    , reel_png: "res/gameplay/reel.png"
    , reelbg_png: "res/gameplay/reelbg.png"
    , reelmask_png: "res/gameplay/reelmask.png"
    , coins_sfx: "res/sfx/coins.wav"
    , spinEnd_sfx: "res/sfx/spin_end.wav"
    , spin_sfx: "res/sfx/spin.wav"
};

//Game scene resources
var g_resources = [];
for ( var i in res ) {
    g_resources.push(res[i]);
}

