import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { SoundHub } from "../soundhub.class.js";
import { MovableObject } from "./movable-object.class.js";

/**
 * Normal enemy chicken.
 */
export class Chicken extends MovableObject{
    y = 360;
    width = 70;
    height = 55;
    isDying = false;
    
    // Image Hub
    CHICKEN_WALK = ImageHub.chicken_normal.walk;
    CHICKEN_DEAD = ImageHub.chicken_normal.dead;

    // Sound Hub
    SOUND_DEAD = SoundHub.chicken.dead;

    /**
     * Creates one chicken with random speed and position.
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
     * Sets facing direction to the left.
     * @returns {void}
     */
    moveLeft(){
        this.otherDirection = false;
    }

    /**
     * Marks chicken as dying, plays sound, and removes it.
     * @returns {void}
     */
    dead() {
        if (this.isDying) return;

        this.energy = 0;
        this.isDying = true;
        this.speed = 0;

        SoundHub.playOne(SoundHub.chicken.dead);
        IntervalHub.startTimeout(() => {
            this.markedForRemoval = true;
        }, 60);
    }

    /**
     * Plays chicken death sound.
     * @returns {void}
     */
    deathSound() {
        SoundHub.play(SoundHub.chicken.dead);
    }

    /**
     * Returns true if chicken energy is zero.
     * @returns {boolean}
     */
    isDead() {
        return this.energy === 0;
    }
}