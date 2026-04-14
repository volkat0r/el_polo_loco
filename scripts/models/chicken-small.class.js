import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { SoundHub } from "../soundhub.class.js";
import { MovableObject } from "./movable-object.class.js";

/**
* Small enemy chicken.
*/
export class ChickenSmall extends MovableObject{
    y = 370;
    width = 45;
    height = 45;
    isDying = false;
    
    // Image Hub
    CHICKEN_WALK = ImageHub.chicken_small.walk;
    CHICKEN_DEAD = ImageHub.chicken_small.dead;
    SOUND_DEAD = SoundHub.chicken.dead_small;

    /**
    * Creates small chicken with random speed and position.
    */
    constructor(){
        super();
        this.showFrame = false;
        this.showOffsetFrame = false;
        this.loadImage(this.CHICKEN_WALK[0]);
        this.loadImages(this.CHICKEN_WALK);
        this.loadImages(this.CHICKEN_DEAD);
        this.x = 200 + Math.random() * 1100;
        this.speed = 0.15 + Math.random() * 1;
        this.animate();
        this.offset = {left: 0, right: 0, top: 0, bottom: 0};
    }

    /**
    * Starts movement and animation intervals.
    * @returns {void}
    */
    animate(){
        IntervalHub.startInterval(this.selectAnimation, 1000 / 200);
        IntervalHub.startInterval(this.moveLeft, 1000 / 60);
    }

    /**
    * Sets facing direction to the left.
    * @returns {void}
    */
    moveLeft(){
        this.otherDirection = false;
    }

    /**
    * Selects walk or dead animation.
    * @returns {void}
    */
    selectAnimation = () => {
        if (this.isDying) {
            this.playAnimation(this.CHICKEN_DEAD);
        } else {
            this.playAnimation(this.CHICKEN_WALK);
        }
    }

    /**
    * Marks chicken as dying and removes it shortly after.
    * @returns {void}
    */
    dead() {
        if (this.isDying) return;
        this.energy = 0;
        this.isDying = true;
        this.speed = 0;
        SoundHub.playOne(SoundHub.chicken.dead_small);
        IntervalHub.startTimeout(() => {
            this.markedForRemoval = true;
        }, 60);
    }

    /**
    * Plays the small chicken death sound.
    * @returns {void}
    */
    deathSound() {
        SoundHub.play(SoundHub.chicken.dead_small);
    }
    /**
    * Returns true if chicken energy is zero.
    * @returns {boolean}
    */
    isDead() {
        return this.energy === 0;
    }
}
