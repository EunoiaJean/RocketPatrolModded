/*
Eugene Shin
Implement the speed increase that happens after 30 seconds in the original game (10)
Display the time remaining (in seconds) on the screen (15)
Implement a new timing/scoring mechanism that adds time to the clock for successful hits (25)
Implement a simultaneous two-player mode (50)
100 total points
*/
let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ],
};
let game = new Phaser.Game(config);
// define game settings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000    
}

// reserve some keyboard variables
let keyUP, keyLEFT, keyRIGHT, keyUP2, keyLEFT2, keyRIGHT2;
var text;
var timedEvent;
// score display
let scoreConfig = {
    fontFamily: 'Courier',
    fontSize: '28px',
    backgroundColor: '#F3B141',
    color: '#843605',
    align: 'right',
    padding: {
        top: 5,
        bottom: 5,
    },
    fixedWidth: 100
}
var setTime;
var spaceTime;