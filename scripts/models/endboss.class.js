import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Endboss extends MovableObject {
    x = 2500;
    y = 60;
    width = 250;
    height = 400;
    energy = 100;

    isEndboss = true;
    isDying = false;
    isActive = false;

    ENDBOSS_WALK = ImageHub.end_boss.walk;
    ENDBOSS_DEAD = ImageHub.end_boss.dead;

    constructor() {
        super();
        this.loadImage('./assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.ENDBOSS_WALK);
        this.loadImages(this.ENDBOSS_DEAD);
        this.speed = 2.5;
    }

    activate() {
        if (this.isActive) return;
        this.isActive = true;
        
        this.startMovement();
        this.startAnimation();
    }

    startMovement() {
        IntervalHub.startInterval(() => {
            if (this.isDying) return;
            this.moveLeft();
        }, 1000 / 60);
    }

    startAnimation() {
        IntervalHub.startInterval(() => {
            if (this.isDying) return;
            this.playAnimation(this.ENDBOSS_WALK);
        }, 150);
    }

    hit(damage = 20) {
        if (this.isDying) return;

        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.dead();
        }
    }

    dead() {
        this.isDying = true;
        this.playAnimation(this.ENDBOSS_DEAD);
        IntervalHub.startTimeout(() => {this.markedForRemoval = true;}, 1000);
    }
}
