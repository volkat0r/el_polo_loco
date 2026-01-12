import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { SoundHub } from "../soundhub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Chicken extends MovableObject{
    y = 360;
    width = 70;
    height = 55;a
    isDying = false;
    
    // Image Hub
    CHICKEN_WALK = ImageHub.chicken_normal.walk;
    CHICKEN_DEAD = ImageHub.chicken_normal.dead;

    // Sound Hub
    SOUND_DEAD = SoundHub.chicken.dead;

    constructor(){
        super();
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.CHICKEN_WALK[0]);
        this.loadImages(this.CHICKEN_WALK);
        this.loadImages(this.CHICKEN_DEAD);
        this.x = 200 + Math.random() * 1100;
        this.speed = 0.15 + Math.random() * 1;
        this.animate();
        this.offset = {left: 0, right: 0, top: 0, bottom: 0};
    }

    animate(){
        IntervalHub.startInterval(this.selectAnimation, 1000 / 200);
        IntervalHub.startInterval(this.moveLeft, 1000 / 60);
    }

    selectAnimation = () => {
        if (this.isDying) {
            this.playAnimation(this.CHICKEN_DEAD);
        } else {
            this.playAnimation(this.CHICKEN_WALK);
        }
    }

    moveLeft(){
        this.otherDirection = false;
    }

    dead() {
        if (this.isDying) return;

        this.energy = 0;
        this.isDying = true;
        this.speed = 0;

        // SoundHub.playOne(SoundHub.chicken.dead);
        IntervalHub.startTimeout(() => {
            this.markedForRemoval = true;
        }, 60);
    }

    deathSound() {
        SoundHub.play(SoundHub.chicken.dead);
    }

    isDead() {
        return this.energy === 0;
    }
}