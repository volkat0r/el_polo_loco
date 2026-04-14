import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { SoundHub } from "../soundhub.class.js";
import { applyCharacterHit, playCharacterDeathAnimation, processCharacterInput, selectCharacterAnimation } from "./character/character-behavior.js";
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
    IDLE_FRAME_INTERVAL_MS = 180;
    lastIdleFrameAt = 0;
    JUMP_FRAME_INTERVAL_MS = 100;
    lastJumpFrameAt = 0;
    isInLongIdle = false;

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
        this.preloadCharacterImages();
        this.animate();
        this.applyGravity();
        this.setCharacterOffset();
    }

    /**
    * Preloads all character sprite image groups.
    * @returns {void}
    */
    preloadCharacterImages() {
        this.loadImage(this.IMAGES_WALK[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_IDLE_LONG);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
    }

    /**
    * Sets collision offsets for the character.
    * @returns {void}
    */
    setCharacterOffset() {
        this.offset = { left: 40, right: 40, top: 140, bottom: 15 };
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
        selectCharacterAnimation(this);
    }

    /**
    * Stops long-idle snore loop and resets its state flag.
    * @returns {void}
    */
    stopLongIdleSnore() {
        if (!this.isInLongIdle) return;
        SoundHub.stopSingle(this.SOUND_IDLE);
        this.isInLongIdle = false;
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
        processCharacterInput(this);
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
        return applyCharacterHit(this, enemy);
    }

    /**
    * Plays the death animation exactly once and keeps the character at a
    * fixed y-position until the animation is finished.
    * @returns {void}
    */
    playDeadAnimationOnce() {
        playCharacterDeathAnimation(this);
    }

    /**
    * Moves the character down after the death animation has finished.
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
