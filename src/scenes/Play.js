class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/title sprite
        this.load.image('rocket', './assets/rocket.png')
        this.load.image('rocket2', './assets/rocket2.png')
        this.load.image('spaceship', './assets/spaceship.png')
        this.load.image('starfield', './assets/starfield.png')
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }
    create() {
        //reset time
        game.settings.gameTimer = setTime;
        game.settings.spaceshipSpeed = spaceTime;
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0, 0);

        //add rocket (p1)
        this.p1Rocket = new Rocket(this, 2*game.config.width/3, 431, 'rocket', 0, 0).setScale(0.5, 0.5).setOrigin(0,0);
        //add rocket(p2)
        this.p2Rocket = new Rocket2(this, game.config.width/3, 431, 'rocket2', 0, 0).setScale(0.5, 0.5).setOrigin(0,0);

        //add spaceship (x3)
        this.ship01 = new Spaceship(this, game.config.width +192, 132, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship02 = new Spaceship(this, game.config.width +96, 196, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10).setOrigin(0,0);
        

        //define keyboard keys
        
        keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyUP2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyLEFT2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyRIGHT2 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        // animation config
        this.anims.create({
        key: 'explode',
        frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
        frameRate: 30
        });

        //score
        this.p1Rocket.score =0;
        this.p2Rocket.score =0;

        this.scoreLeft = this.add.text(69, 54, 'P1:'+ this.p1Rocket.score, scoreConfig);
        this.scoreRight = this.add.text(500, 54, 'P2:'+this.p2Rocket.score, scoreConfig);

        //game over flag
        this.gameOver = false;
        //countdown timer
        text = this.add.text(game.config.width/2, 60, formatTime(game.settings.gameTimer), scoreConfig);

        // Each 1000 ms call onEvent
        timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, repeat: game.settings.gameTimer });

        //after 30 seconds speed up
        let speed = this.time.delayedCall(30000, () => { game.settings.spaceshipSpeed *=2; }, null, this)
    }

    update() {
        //scroll starfield
        this.starfield.tilePositionX -= 4;

        //update spaceship
        if(!this.gameOver) {
            this.p1Rocket.update();
            this.p2Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }
        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, this.p1Rocket);
            this.p1Rocket.score += this.ship03.points;
            this.scoreLeft.text = 'P1:'+ this.p1Rocket.score;
            game.settings.gameTimer += 1000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, this.p1Rocket);
            this.p1Rocket.score += this.ship02.points; 
            this.scoreLeft.text = 'P1:'+ this.p1Rocket.score;  
            game.settings.gameTimer += 2000;
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, this.p1Rocket);
            this.p1Rocket.score += this.ship01.points;
            this.scoreLeft.text = 'P1:'+ this.p1Rocket.score;   
            game.settings.gameTimer += 3000;
        }
        if(this.checkCollision(this.p2Rocket, this.ship03)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship03, this.p2Rocket);
            this.p2Rocket.score += this.ship03.points;   
            this.scoreRight.text = 'P2:'+this.p2Rocket.score;  
            game.settings.gameTimer += 1000; 
        }
        if (this.checkCollision(this.p2Rocket, this.ship02)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship02, this.p2Rocket);
            this.p2Rocket.score += this.ship02.points; 
            this.scoreRight.text = 'P2:'+this.p2Rocket.score; 
            game.settings.gameTimer += 2000;
        }
        if (this.checkCollision(this.p2Rocket, this.ship01)) {
            this.p2Rocket.reset();
            this.shipExplode(this.ship01, this.p2Rocket);
            this.p2Rocket.score += this.ship01.points; 
            this.scoreRight.text = 'P2:'+this.p2Rocket.score;   
            game.settings.gameTimer += 3000;
        }
          // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyUP2)) {
            this.scene.restart(this.p1Score);
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT2)) {
            this.scene.start("menuScene");
        }
        if(game.settings.gameTimer <=0 )
        {
        scoreConfig.fixedWidth = 0;
        text.setText(formatTime(0));
        this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 + 64, 'Fire to Restart or <- for Menu', scoreConfig).setOrigin(0.5);
        this.gameOver=true;
        }
    }
    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }
    shipExplode(ship, rocket) {
        ship.alpha = 0;                         // temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after animation completes
            ship.reset();                       // reset ship position
            ship.alpha = 1;                     // make ship visible again
            boom.destroy();                     // remove explosion sprite
        });
        // score increment and repaint      
        this.sound.play('sfx_explosion');
    }
}

function formatTime(seconds){
    // Seconds
    var partInSeconds = seconds/1000;
    // Adds left zeros to seconds
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    // Returns formated time
    return `${partInSeconds}`;
}

function onEvent ()
{
    game.settings.gameTimer -= 1000; // One second
    text.setText(formatTime(game.settings.gameTimer));
}