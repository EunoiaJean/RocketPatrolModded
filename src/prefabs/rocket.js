class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x ,y ,texture, frame){
        super (scene, x , y, texture, frame);
        scene.add.existing(this); //add object to existing scene, displayList, updateList
        this.isFiring = false;
        this.sfxRocket = scene.sound.add('sfx_rocket'); // add rocket sfx
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyLEFT2.isDown && this.x >= 47){
                this.x -=2;
            } else if(keyRIGHT2.isDown && this.x <=578){
                this.x +=2;
            }

        }
        //fire button
        if(Phaser.Input.Keyboard.JustDown(keyUP2) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); //play sfx
        }
        //if fired, move up
        if(this.isFiring && this.y>=108){
            this.y -=2;
        }
        //reset on miss
        if(this.y <=108){
            this.reset();
        }
    }
    //reset rocket to "ground"
    reset(){
        this.isFiring = false;
        this.y = 431;
    }
}
