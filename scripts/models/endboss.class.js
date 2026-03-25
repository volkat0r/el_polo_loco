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
    deathAnimationFrame = 0;
    deathAnimationDone = false;
    world;
    moveDirection = -1;
    DEAD_ANIMATION_INTERVAL_MS = 150;
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
            if (this.isDying) {
                this.playDeadAnimationOnce();
                return;
            }

            this.playAnimation(this.ENDBOSS_WALK);
        }, this.DEAD_ANIMATION_INTERVAL_MS);
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
        if (this.isDying) return;

        this.isDying = true;
        this.speed = 0;
        this.deathAnimationFrame = 0;
        this.deathAnimationDone = false;
    }

    playDeadAnimationOnce() {
        const lastFrameIndex = this.ENDBOSS_DEAD.length - 1;
        const frameIndex = Math.min(this.deathAnimationFrame, lastFrameIndex);
        const framePath = this.ENDBOSS_DEAD[frameIndex];

        this.img = this.imageCache[framePath];

        if (this.deathAnimationFrame < lastFrameIndex) {
            this.deathAnimationFrame++;
            return;
        }

        this.deathAnimationDone = true;
    }

    getDeathAnimationDurationMs() {
        let totalDurationMs = 0;

        for (let i = 0; i < this.ENDBOSS_DEAD.length; i++) {
            totalDurationMs += this.DEAD_ANIMATION_INTERVAL_MS;
        }

        return totalDurationMs;
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
