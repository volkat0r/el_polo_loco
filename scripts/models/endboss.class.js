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
    world;
    moveDirection = -1;
    ENDBOSS_WALK = ImageHub.end_boss.walk;
    ENDBOSS_DEAD = ImageHub.end_boss.dead;

    constructor() {
        super();
        this.loadImage('./assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.ENDBOSS_WALK);
        this.loadImages(this.ENDBOSS_DEAD);
        this.speed = 2.5;
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.offset = {left: 20, right: 10, top: 35, bottom: 35};
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
            this.watchingLevel();
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

    watchingLevel() {
        if (!this.world) return;

        if (this.characterIsBehind()) {
            this.moveDirection *= -1;
        }

        if (this.moveDirection < 0) {
            this.otherDirection = false;
            this.x = Math.max(this.x - this.speed, this.getMinX());
            if (this.x <= this.getMinX()) {
                this.moveDirection = 1;
            }
            return;
        }

        this.otherDirection = true;
        this.x = Math.min(this.x + this.speed, this.getMaxX());
        if (this.x >= this.getMaxX()) {
            this.moveDirection = -1;
        }
    }

    characterIsBehind() {
        const characterCenter = this.world.character.x + this.world.character.width / 2;
        const bossCenter = this.x + this.width / 2;
        const turnThreshold = 20;

        if (this.moveDirection < 0) {
            return characterCenter > bossCenter + turnThreshold;
        }

        return characterCenter < bossCenter - turnThreshold;
    }

    getMinX() {
        return 0;
    }

    getMaxX() {
        return this.world.level.level_end_x + this.world.canvas.width - this.width;
    }
}
