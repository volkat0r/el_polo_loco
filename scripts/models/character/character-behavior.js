import { SoundHub } from "../../soundhub.class.js";

/**
 * Selects and plays the current character animation.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
export function selectCharacterAnimation(character) {
    const inLongIdle = character.fallAsleep();
    const isInAir = character.isAboveGround() || character.speedY > 0;
    if (handleDeadAnimationState(character)) return;
    if (handleLandingFromJump(character, isInAir)) return;
    if (handleAirAnimationState(character, isInAir)) return;
    if (handleHurtAnimationState(character)) return;
    if (handleWalkAnimationState(character)) return;
    handleIdleAnimationState(character, inLongIdle);
}

/**
 * Processes character input for movement and jumping.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
export function processCharacterInput(character) {
    if (character.isDead()) return;
    if (character.hasInput()) character.getLastMove();
    handleHorizontalInput(character);
    handleJumpInput(character);
}

/**
 * Applies damage to the character and returns whether the hit was accepted.
 * @param {import("../character.class.js").Character} character
 * @returns {boolean}
 */
export function applyCharacterHit(character) {
    if (!canTakeDamage(character)) return false;
    applyStandardDamage(character);
    playDamageFeedbackSound(character);
    character.lastHit = Date.now();
    return true;
}

/**
 * Plays the character death animation sequence.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
export function playCharacterDeathAnimation(character) {
    startDeathSequenceIfNeeded(character);
    lockDeathYPosition(character);
    renderDeathFrame(character);
    advanceDeathFrame(character);
}

/**
 * Handles death animation state.
 * @param {import("../character.class.js").Character} character
 * @returns {boolean}
 */
function handleDeadAnimationState(character) {
    if (!character.isDead()) return false;
    SoundHub.stopSingle(character.SOUND_WALK);
    character.stopLongIdleSnore();
    playCharacterDeathAnimation(character);
    character.updateDeathFall();
    return true;
}

/**
 * Resets walk animation when landing from a jump.
 * @param {import("../character.class.js").Character} character
 * @param {boolean} isInAir
 * @returns {boolean}
 */
function handleLandingFromJump(character, isInAir) {
    if (!character.wasJumping || isInAir) return false;
    character.wasJumping = false;
    SoundHub.stopSingle(character.SOUND_WALK);
    character.resetWalkAnimationStart();
    return true;
}

/**
 * Handles jump animation state while character is in the air.
 * @param {import("../character.class.js").Character} character
 * @param {boolean} isInAir
 * @returns {boolean}
 */
function handleAirAnimationState(character, isInAir) {
    if (!isInAir) return false;
    character.wasJumping = true;
    SoundHub.stopSingle(character.SOUND_WALK);
    character.stopLongIdleSnore();
    playJumpFrameIfDue(character);
    return true;
}

/**
 * Plays the next jump frame when the timer elapsed.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function playJumpFrameIfDue(character) {
    const now = Date.now();
    if (now - character.lastJumpFrameAt < character.JUMP_FRAME_INTERVAL_MS) return;
    character.playAnimation(character.IMAGES_JUMP);
    character.lastJumpFrameAt = now;
}

/**
 * Handles hurt animation state.
 * @param {import("../character.class.js").Character} character
 * @returns {boolean}
 */
function handleHurtAnimationState(character) {
    if (!character.isHurt()) return false;
    SoundHub.stopSingle(character.SOUND_WALK);
    character.stopLongIdleSnore();
    character.playAnimation(character.IMAGES_HURT);
    return true;
}

/**
 * Handles walk animation state.
 * @param {import("../character.class.js").Character} character
 * @returns {boolean}
 */
function handleWalkAnimationState(character) {
    if (!character.world.keyboard.RIGHT && !character.world.keyboard.LEFT) return false;
    if (character.wasJumping) resetWalkAfterJump(character);
    character.playAnimation(character.IMAGES_WALK);
    SoundHub.playLoop(character.SOUND_WALK, 0.1);
    character.stopLongIdleSnore();
    return true;
}

/**
 * Resets walk state after jumping.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function resetWalkAfterJump(character) {
    character.resetWalkAnimationStart();
    character.wasJumping = false;
}

/**
 * Handles idle and long-idle animation state.
 * @param {import("../character.class.js").Character} character
 * @param {boolean} inLongIdle
 * @returns {void}
 */
function handleIdleAnimationState(character, inLongIdle) {
    SoundHub.stopSingle(character.SOUND_WALK);
    updateLongIdleSnoreState(character, inLongIdle);
    playIdleFrameIfDue(character, inLongIdle);
}

/**
 * Starts or stops the long-idle snore loop.
 * @param {import("../character.class.js").Character} character
 * @param {boolean} inLongIdle
 * @returns {void}
 */
function updateLongIdleSnoreState(character, inLongIdle) {
    if (inLongIdle && !character.isInLongIdle) {
        SoundHub.playLoop(character.SOUND_IDLE, 0.1);
        character.isInLongIdle = true;
    }

    if (!inLongIdle && character.isInLongIdle) character.stopLongIdleSnore();
}

/**
 * Plays the next idle frame when the timer elapsed.
 * @param {import("../character.class.js").Character} character
 * @param {boolean} inLongIdle
 * @returns {void}
 */
function playIdleFrameIfDue(character, inLongIdle) {
    const now = Date.now();
    if (now - character.lastIdleFrameAt < character.IDLE_FRAME_INTERVAL_MS) return;
    const idleImages = inLongIdle ? character.IMAGES_IDLE_LONG : character.IMAGES_IDLE;
    character.playAnimation(idleImages);
    character.lastIdleFrameAt = now;
}

/**
 * Handles horizontal movement input.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function handleHorizontalInput(character) {
    if (character.world.keyboard.RIGHT && character.x < character.getMaxCharacterX()) {
        character.moveRight();
        character.otherDirection = false;
    }

    if (character.world.keyboard.LEFT && character.x > 0) {
        character.otherDirection = true;
        character.moveLeft();
    }
}

/**
 * Handles jump input.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function handleJumpInput(character) {
    if (!character.world.keyboard.UP || character.isAboveGround()) return;
    SoundHub.playOne(character.SOUND_JUMP);
    character.jump();
}

/**
 * Returns whether the character can currently take damage.
 * @param {import("../character.class.js").Character} character
 * @returns {boolean}
 */
function canTakeDamage(character) {
    if (character.isDead()) return false;
    return !character.isHurt();
}

/**
 * Applies one standard damage step and clamps the minimum energy.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function applyStandardDamage(character) {
    character.energy -= 20;
    if (character.energy < 0) character.energy = 0;
}

/**
 * Plays hurt or death feedback sound.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function playDamageFeedbackSound(character) {
    if (character.energy === 0) {
        SoundHub.playOne(character.SOUND_DEAD);
        return;
    }

    SoundHub.playOne(character.SOUND_HURT);
}

/**
 * Initializes values at the start of the death sequence.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function startDeathSequenceIfNeeded(character) {
    if (character.isDying) return;
    character.isDying = true;
    character.deathAnimationFrame = 0;
    character.deathAnimationDone = false;
    character.isFallingAfterDeath = false;
    character.hasFallenOutOfScreen = false;
    character.deathStartY = character.y;
    character.speedY = 0;
}

/**
 * Keeps the character at a fixed y-position while dying.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function lockDeathYPosition(character) {
    if (character.deathAnimationDone || character.deathStartY === null) return;
    character.y = character.deathStartY;
}

/**
 * Draws the current death frame image.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function renderDeathFrame(character) {
    const lastFrameIndex = character.IMAGES_DEAD.length - 1;
    const frameIndex = Math.min(character.deathAnimationFrame, lastFrameIndex);
    const framePath = character.IMAGES_DEAD[frameIndex];
    character.img = character.imageCache[framePath];
}

/**
 * Advances the death animation frame counter.
 * @param {import("../character.class.js").Character} character
 * @returns {void}
 */
function advanceDeathFrame(character) {
    const lastFrameIndex = character.IMAGES_DEAD.length - 1;
    if (character.deathAnimationFrame >= lastFrameIndex) {
        character.deathAnimationDone = true;
        return;
    }

    character.deathAnimationFrame++;
}
