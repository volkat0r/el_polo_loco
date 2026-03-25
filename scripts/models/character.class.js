import { IntervalHub } from "../intervalhub.class.js";
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
    lastMove = 100;
    lastHit = 0;
    DAMAGE_COOLDOWN_MS = 500;
    DEAD_ANIMATION_INTERVAL_MS = 1000 / 20;
    isDying = false;
    deathAnimationFrame = 0;
    deathAnimationDone = false;
    isFallingAfterDeath = false;
    hasFallenOutOfScreen = false;
    DEATH_FALL_SPEED = 12;
    deathStartY = null;

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
        this.showFrame = false;
        this.showOffsetFrame = false;
        this.loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        this.animate();
        this.applyGravity();

        this.offset = {left: 40, right: 40, top: 140, bottom: 15};
    }

    animate(){
        IntervalHub.startInterval(this.inputCheck, 1000 / 120);
        IntervalHub.startInterval(this.selectAnimation, 1000 / 20);
    }

    selectAnimation = () => {
        if (this.isDead()) {
            // Dead Animation
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playDeadAnimationOnce();
            this.updateDeathFall();
        } else if(this.isAboveGround()) {
            // Jump Animation
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playAnimation(this.IMAGES_JUMP);
        } else if (this.isHurt()) {
            // Hurt Animation
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            // Walk Animation
            this.playAnimation(this.IMAGES_WALK);
            SoundHub.playLoop(this.SOUND_WALK, 0.1);
        } else if (this.fallAsleep()){
            // Sleep Animation
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            SoundHub.stopSingle(this.SOUND_WALK);
        };
    }

    inputCheck = () => {
        if (this.isDead()) return;

        if(this.world.keyboard.RIGHT && this.x < this.getMaxCharacterX()) {
            this.moveRight();
            this.otherDirection = false;
        }
        if(this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
        }
        if (this.world.keyboard.UP && !this.isAboveGround()){
            SoundHub.playOne(this.SOUND_JUMP);
            this.jump();
        }
    }

    getMaxCharacterX() {
        if (!this.world || !this.world.canvas || !this.world.level) {
            return Number.POSITIVE_INFINITY;
        }

        // level_end_x is the camera limit; convert it to the furthest character x.
        return this.world.level.level_end_x + this.world.canvas.width - this.width;
    }

    getLastMove(){
        this.lastMove = new Date().getTime();
    }

    fallAsleep(){
        let time = new Date().getTime() - this.lastMove;
        time = time / 1000;
    }

    hit(enemy) {
        if (this.isDead()) {
            return false;
        }

        if (this.isHurt()) {
            return false;
        }

        this.energy -= 20;
        if (this.energy < 0) {
            this.energy = 0;
        }

        if (this.energy === 0) {
            SoundHub.playOne(this.SOUND_DEAD);
        } else {
            SoundHub.playOne(this.SOUND_HURT);
        }

        this.lastHit = Date.now();
        return true;
    }

    playDeadAnimationOnce() {
        if (!this.isDying) {
            this.isDying = true;
            this.deathAnimationFrame = 0;
            this.deathAnimationDone = false;
            this.isFallingAfterDeath = false;
            this.hasFallenOutOfScreen = false;
            this.deathStartY = this.y;
            this.speedY = 0;
        }

        if (!this.deathAnimationDone && this.deathStartY !== null) {
            this.y = this.deathStartY;
        }

        const lastFrameIndex = this.IMAGES_DEAD.length - 1;
        const frameIndex = Math.min(this.deathAnimationFrame, lastFrameIndex);
        const framePath = this.IMAGES_DEAD[frameIndex];

        this.img = this.imageCache[framePath];

        if (this.deathAnimationFrame < lastFrameIndex) {
            this.deathAnimationFrame++;
            return;
        }

        this.deathAnimationDone = true;
    }

    updateDeathFall() {
        if (!this.deathAnimationDone) return;

        this.isFallingAfterDeath = true;
        this.speedY = 0;
        this.y += this.DEATH_FALL_SPEED;

        const canvasHeight = this.world?.canvas?.height ?? 480;
        if (this.y >= canvasHeight + this.height) {
            this.hasFallenOutOfScreen = true;
        }
    }

    hasCompletedDeathSequence() {
        return this.deathAnimationDone && this.hasFallenOutOfScreen;
    }

    gravityInterval = () => {
        if (this.isDead()) {
            return;
        }

        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    getDeathAnimationDurationMs() {
        return this.IMAGES_DEAD.length * this.DEAD_ANIMATION_INTERVAL_MS;
    }

    isHurt(){
        const timePassed = Date.now() - this.lastHit;
        return timePassed < this.DAMAGE_COOLDOWN_MS;
    }

    isDead(){
        return this.energy == 0;
    }
}