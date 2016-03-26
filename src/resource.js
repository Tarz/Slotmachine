var preloaderRes = {
     sheet_plist: "res/loaderSheet.plist"
    ,sheet_png: "res/loaderSheet.png"
};

//Preloader scene resources
var g_loaderResources = [];
for ( var i in preloaderRes ) {
    g_loaderResources.push(preloaderRes[i]);
}


var res = {
      sheet_plist: "res/sheet.plist"
    , sheet_png: "res/sheet.png"
    , coins_sfx: "res/sfx/coins.wav"
    , spinEnd_sfx: "res/sfx/spin_end.wav"
    , spin_sfx: "res/sfx/spin.wav"
};

//Game scene resources
var g_resources = [];
for ( var i in res ) {
    g_resources.push(res[i]);
}

