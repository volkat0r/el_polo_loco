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
    isAlerting = false;
    isHurt = false;
    isTilted = false;
    hitCount = 0;
    alertAnimationFrame = 0;
    hurtAnimationFrame = 0;
    deathAnimationFrame = 0;
    deathAnimationDone = false;
    world;
    moveDirection = -1;
    DEAD_ANIMATION_INTERVAL_MS = 150;
    ENDBOSS_WALK = ImageHub.end_boss.walk;
    ENDBOSS_ALERT = ImageHub.end_boss.alert;
    ENDBOSS_ATTACK = ImageHub.end_boss.attack;
    ENDBOSS_HURT = ImageHub.end_boss.hurt;
    ENDBOSS_DEAD = ImageHub.end_boss.dead;

    /**
     * Creates the endboss and preloads its sprites.
     */
    constructor() {
        super();
        this.loadImage('./assets/img/4_enemie_boss_chicken/1_walk/G1.png');
        this.loadImages(this.ENDBOSS_WALK);
        this.loadImages(this.ENDBOSS_ALERT);
        this.loadImages(this.ENDBOSS_ATTACK);
        this.loadImages(this.ENDBOSS_HURT);
        this.loadImages(this.ENDBOSS_DEAD);
        this.speed = 2.5;
        this.showFrame = false;
        this.showOffsetFrame = false;
        this.offset = {left: 20, right: 10, top: 35, bottom: 35};
    }

    /**
     * Activates the endboss behavior loops.
     * @returns {void}
     */
    activate() {
        if (this.isActive) return;
        this.isActive = true;
        this.isAlerting = true;
        this.alertAnimationFrame = 0;
        
        this.startMovement();
        this.startAnimation();
    }

    /**
     * Starts movement loop for the endboss.
     * @returns {void}
     */
    startMovement() {
        IntervalHub.startInterval(() => {
            if (this.isDying) return;
            if (this.isAlerting) return;
            this.watchingLevel();
        }, 1000 / 60);
    }

    /**
     * Starts animation loop based on current state.
     * @returns {void}
     */
    startAnimation() {
        IntervalHub.startInterval(() => {
            if (this.isDying) {
                this.playDeadAnimationOnce();
                return;
            }

            if (this.isAlerting) {
                this.playAlertAnimationOnce();
                return;
            }

            if (this.isHurt) {
                this.playHurtAnimationOnce();
                return;
            }

            if (this.isTilted) {
                this.playAnimation(this.ENDBOSS_ATTACK);
                return;
            }

            this.playAnimation(this.ENDBOSS_WALK);
        }, this.DEAD_ANIMATION_INTERVAL_MS);
    }

    /**
     * Applies damage and updates boss state.
     * @param {number} [damage=20]
     * @returns {void}
     */
    hit(damage = 20) {
        if (this.isDying) return;

        this.isHurt = true;
        this.hurtAnimationFrame = 0;

        this.hitCount++;
        if (this.hitCount >= 2) {
            this.isTilted = true;
        }

        if (this.speed < 7) {
            this.speed += 0.5;
        }

        this.energy -= damage;
        if (this.energy <= 0) {
            this.energy = 0;
            this.dead();
        }
    }

    /**
     * Starts death state and stops movement.
     * @returns {void}
     */
    dead() {
        if (this.isDying) return;

        this.isDying = true;
        this.speed = 0;
        this.deathAnimationFrame = 0;
        this.deathAnimationDone = false;
    }

    /**
     * Plays dead animation once.
     * @returns {void}
     */
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

    /**
     * Plays alert animation once.
     * @returns {void}
     */
    playAlertAnimationOnce() {
        const lastFrameIndex = this.ENDBOSS_ALERT.length - 1;
        const frameIndex = Math.min(this.alertAnimationFrame, lastFrameIndex);
        const framePath = this.ENDBOSS_ALERT[frameIndex];

        this.img = this.imageCache[framePath];

        if (this.alertAnimationFrame < lastFrameIndex) {
            this.alertAnimationFrame++;
            return;
        }

        this.isAlerting = false;
    }

    /**
     * Plays hurt animation once.
     * @returns {void}
     */
    playHurtAnimationOnce() {
        const lastFrameIndex = this.ENDBOSS_HURT.length - 1;
        const frameIndex = Math.min(this.hurtAnimationFrame, lastFrameIndex);
        const framePath = this.ENDBOSS_HURT[frameIndex];

        this.img = this.imageCache[framePath];

        if (this.hurtAnimationFrame < lastFrameIndex) {
            this.hurtAnimationFrame++;
            return;
        }

        this.isHurt = false;
    }

    /**
     * Returns total dead animation time in ms.
     * @returns {number}
     */
    getDeathAnimationDurationMs() {
        return this.ENDBOSS_DEAD.length * this.DEAD_ANIMATION_INTERVAL_MS;
    }

    /**
     * Moves the endboss inside level borders.
     * @returns {void}
     */
    watchingLevel() {
        if (!this.world) return;

        if (this.characterIsBehind()) {
            this.moveDirection *= -1;
        }

        if (this.moveDirection < 0) {
            this.otherDirection = false;
            this.x -= this.speed;
            if (this.x <= this.getMinX()) {
                this.x = this.getMinX();
                this.moveDirection = 1;
            }
            return;
        }

        this.otherDirection = true;
        this.x += this.speed;
        if (this.x >= this.getMaxX()) {
            this.x = this.getMaxX();
            this.moveDirection = -1;
        }
    }

    /**
     * Checks if character is behind current move direction.
     * @returns {boolean}
     */
    characterIsBehind() {
        let charCenter = this.world.character.x + this.world.character.width / 2;
        let bossCenter = this.x + this.width / 2;

        if (this.moveDirection < 0) {
            return charCenter > bossCenter + 20;
        }

        return charCenter < bossCenter - 20;
    }

    /**
     * Returns left movement limit.
     * @returns {number}
     */
    getMinX() {
        return 0;
    }

    /**
     * Returns right movement limit.
     * @returns {number}
     */
    getMaxX() {
        return this.world.level.level_end_x + this.world.canvas.width - this.width;
    }
}
