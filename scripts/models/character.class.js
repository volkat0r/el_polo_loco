import { IntervallHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { SoundHub } from "../soundhub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Character extends MovableObject{
    x = 100;
    y = 0;
    width = 152;
    height = 300;
    speed = 4;
    world;
    lastHit = 0;

    // Image Hub
    IMAGES_IDLE = ImageHub.character.idle;
    IMAGES_IDLE_LONG = ImageHub.character.idle_long;
    IMAGES_WALK = ImageHub.character.walking;
    IMAGES_JUMP = ImageHub.character.jump;
    IMAGES_HURT = ImageHub.character.hurt;
    IMAGES_DEAD = ImageHub.character.dead;
    // Sound Hub
    SOUND_WALK = SoundHub.character.walk;
    SOUND_JUMP = SoundHub.character.jump;
    SOUND_IDLE = SoundHub.character.idle;
    SOUND_HURT = SoundHub.character.hurt;
    SOUND_DEAD = SoundHub.character.dead;

    constructor(){
        super();
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.applyGravity();

        this.offset = {
            left: 40,
            right: 40,
            top: 140,
            bottom: 15
        };

    }

    animate(){
        IntervallHub.startInterval(this.inputCheck, 1000 / 120);
        IntervallHub.startInterval(this.selectAnimation, 1000 / 20);
    }

    selectAnimation = () => {
        if(this.isAboveGround()) {
            // Jump Animation
            this.playAnimation(this.IMAGES_JUMP);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.x += this.speed;
            // Walk Animation
            this.playAnimation(this.IMAGES_WALK);
        } else if (this.isHurt()) {
            // Hurt Animation
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.isDead()) {
            // Dead Animation
            this.playAnimation(this.IMAGES_DEAD);
        };
    }

    inputCheck = () => {
        if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
        }
        if(this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
        }
        if (this.world.keyboard.UP && !this.isAboveGround()){
            this.jump();
        }
        this.world.camera_x = -this.x + 75;
    }

    hit(enemy) {
        this.energy -= 5;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime(); // gets time in ms (since 1970)
        }
    }

    isHurt(){
        let timepassed = new Date() - this.lastHit; // difference of actual- & lastHit-time
        timepassed = timepassed / 100; // recalculate in seconds
        return timepassed < 0.5; // return if 5 seconds are passed
    }

    isDead(){
        return this.energy == 0;
    }
}