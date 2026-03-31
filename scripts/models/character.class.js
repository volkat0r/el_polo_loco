import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { SoundHub } from "../soundhub.class.js";
import { MovableObject } from "./movable-object.class.js";

/**
 * Pepe with input handling, animation state management,
 * damage/death logic, and camera movement.
 */
export class Character extends MovableObject{
    x = 100;
    y = 0;
    width = 152;
    height = 300;
    speed = 4;
    world;
    lastMove = Date.now();
    IDLE_DELAY_MS = 5000;
    lastHit = 0;
    DAMAGE_COOLDOWN_MS = 500;
    DEAD_ANIMATION_INTERVAL_MS = 50;
    isDying = false;
    deathAnimationFrame = 0;
    deathAnimationDone = false;
    isFallingAfterDeath = false;
    hasFallenOutOfScreen = false;
    DEATH_FALL_SPEED = 12;
    deathStartY = null;
    wasJumping = false;

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

    /**
     * Creates a new character instance and preloads all animation frames.
     */
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

        this.offset = {
            left: 40,
            right: 40,
            top: 140,
            bottom: 15
        };
    }

    /**
     * Starts the character update loops for input and animation selection.
     * Input is updated at high frequency for responsiveness.
     */
    animate(){
        IntervalHub.startInterval(this.inputCheck, 1000 / 120);
        IntervalHub.startInterval(this.selectAnimation, 1000 / 20);
    }

    /**
     * Chooses and plays the current animation based on state priority:
     * dead, jump, hurt, walk, idle.
     * @returns {void}
     */
    selectAnimation = () => {
        if (this.isDead()) {
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playDeadAnimationOnce();
            this.updateDeathFall();
            return;
        }

        if (this.wasJumping && !this.isAboveGround()) {
            this.wasJumping = false;
            SoundHub.stopSingle(this.SOUND_WALK);
            this.resetWalkAnimationStart();
            return;
        } else if(this.isAboveGround()) {
            this.wasJumping = true;
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playAnimation(this.IMAGES_JUMP);
        } else if (this.isHurt()) {
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playAnimation(this.IMAGES_HURT);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            if (this.wasJumping) {
                this.resetWalkAnimationStart();
                this.wasJumping = false;
            }
            this.playAnimation(this.IMAGES_WALK);
            SoundHub.playLoop(this.SOUND_WALK, 0.1);
        } else if (this.fallAsleep()){
            SoundHub.stopSingle(this.SOUND_WALK);
            this.playAnimation(this.IMAGES_IDLE);
        } else {
            SoundHub.stopSingle(this.SOUND_WALK);
        };
    }

    /**
     * Resets walk animation to the first frame.
     * @returns {void}
     */
    resetWalkAnimationStart() {
        this.currentImage = 0;
        this.img = this.imageCache[this.IMAGES_WALK[0]];
    }

    /**
     * Applies keyboard input to movement and jump behavior.
     * Stops once character is dead.
     * @returns {void}
     */
    inputCheck = () => {
        if (this.isDead()) return;

        if (this.hasInput()) {
            this.getLastMove();
        }

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

    /**
     * Checks if any relevant control input is currently active.
     * @returns {boolean}
     */
    hasInput() {
        return !!(
            this.world?.keyboard?.RIGHT ||
            this.world?.keyboard?.LEFT ||
            this.world?.keyboard?.UP ||
            this.world?.keyboard?.THROW
        );
    }

    /**
     * Computes the maximum x-position the character may move to.
     * Allows character to move till the end of map
     * @returns {number}
     */
    getMaxCharacterX() {
        if (!this.world || !this.world.canvas || !this.world.level) {
            return Number.POSITIVE_INFINITY;
        }

        // level_end_x is the camera limit; convert it to the furthest character x.
        return this.world.level.level_end_x + this.world.canvas.width - this.width;
    }

    /**
     * Stores the current timestamp as the latest movement/input time.
     * @returns {void}
     */
    getLastMove(){
        this.lastMove = Date.now();
    }

    /**
     * Determines whether the character should switch to idle behavior.
     * @returns {boolean}
     */
    fallAsleep(){
        const inactiveForMs = Date.now() - this.lastMove;
        return inactiveForMs >= this.IDLE_DELAY_MS;
    }

    /**
     * Applies incoming damage and triggers hurt/death sound feedback.
     * Returns false when damage is ignored due to dead/hurt immunity window.
     * @param {unknown} enemy
     * @returns {boolean}
     */
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

    /**
     * needs to be checked again!
     * Plays the death animation frames once and locks vertical position until
     * the sequence is complete.
     * @returns {void}
     */
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

    /**
     * this needs to be checked again / sometimes images of character are not displaying 
     * Moves the dead character downward after death animation has finished.
     * @returns {void}
     */
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

    /**
     * Indicates whether the full death sequence has completed.
     * @returns {boolean}
     */
    hasCompletedDeathSequence() {
        return this.deathAnimationDone && this.hasFallenOutOfScreen;
    }

    /**
     * Gravity update callback used by the base class interval hub.
     * Allows character to keep falling after death.
     * @returns {void}
     */
    gravityInterval = () => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    /**
     * Returns total playback duration of the death animation in milliseconds.
     * @returns {number}
     */
    getDeathAnimationDurationMs() {
        return this.IMAGES_DEAD.length * this.DEAD_ANIMATION_INTERVAL_MS;
    }

    /**
     * Checks whether the temporary post-hit invulnerability is active.
     * @returns {boolean}
     */
    isHurt(){
        const timePassed = Date.now() - this.lastHit;
        return timePassed < this.DAMAGE_COOLDOWN_MS;
    }

    /**
     * Checks whether character health has reached zero.
     * @returns {boolean}
     */
    isDead(){
        return this.energy == 0;
    }
}