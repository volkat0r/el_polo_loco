import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Endboss extends MovableObject {
    x = 2200;
    y = 180;
    width = 304;
    height = 261;

    isEndboss = true;
    energy = 100;
    isDying = false;

    ENDBOSS_WALK = ImageHub.end_boss.walk;
    ENDBOSS_DEAD = ImageHub.end_boss.dead;

    constructor() {
        super();
        this.loadImage(this.ENDBOSS_WALK[0]);
        this.loadImages(this.ENDBOSS_WALK);
        this.loadImages(this.ENDBOSS_DEAD);

        this.speed = 0.15;
        this.animate();
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

        setTimeout(() => {
            this.markedForRemoval = true;
        }, 1000);
    }

    animate() {
        IntervalHub.startInterval(() => {
            if (this.isDying) return;
            this.playAnimation(this.ENDBOSS_WALK);
            this.moveLeft();
        }, 200);
    }
}
