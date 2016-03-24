/* GAME GLOBALS/CONFIG */

/* SCENE GLOBAS */

var g_scWidth = 668; 		// Scene width
var g_scHeight = 436; 		//Scene height

/* REEL GLOBALS */

// count
var g_reelsCount = 3;

// geometry
var g_reelBgWidth = 154; 	//reel bg width
var g_reelBgHeight = 299;   //reel bg height
var g_reelFirstXPos = 60;   //first reel x position from left
var g_reelsYPos = 33; 		//reels y position from top
var g_reelsXSpace = 205; 
var g_reelsOffset = 20;    // for centering reel content

// animation
var g_reelsAnimationTime = 3;  
var g_reelSpeed = 500; 				// reel animation speed 
var g_reelFriction = 1; //.998;		// Here is friction property on the end of spin animation but its not fit with sfx'es

/* SYMBOL GLOBALS */

var g_symbolCount = 20;		//How many symbols used for one reel. Minimum 9 symbols

var g_symbolHeight = 86; 	// Symbol width and height

/* COUNTER GLOBALS */

var g_counterXpos = 30;
var g_counterYpos = 25;
var g_counterBgWidth = 208;
var g_counterBgHeight = 58;

/* BUTTON GLOBALS */

var g_buttonXpos = 620;
var g_buttonYpos = 50; 

var g_buttonInactiveOpacity = 210;

/* BACKGROUND GLOBALS */

var g_bgSize = 300; 

var g_bgRows = 2;		// bg tiles
var g_bgColumns = 3;
		

/* SOUND VOLUME */
//cc.audioEngine.setEffectsVolume(0);
//
/* DEBUG */


