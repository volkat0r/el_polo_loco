import { IntervalHub } from "../../intervalhub.class.js";
import { SoundHub } from "../../soundhub.class.js";
import { ThrowableObject } from "../throwable-object.class.js";

/**
 * Handles lose condition and ends the game when the death sequence finished.
 * @param {import("../world.class.js").World} world
 * @returns {boolean}
 */
export function handleLoseCondition(world) {
    if (!world.character.isDead()) return false;
    if (!world.loseSequenceStarted) world.loseSequenceStarted = true;
    if (!world.character.hasCompletedDeathSequence?.()) return true;
    if (typeof window.endGame === "function") window.endGame("lose");
    return true;
}

/**
 * Handles win condition and schedules the win screen.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function handleWinCondition(world) {
    if (!world.endboss || !world.endboss.isDying) return;
    if (world.winSequenceStarted) return;
    world.winSequenceStarted = true;
    const winDelay = world.endboss.getDeathAnimationDurationMs?.() ?? 1000;
    IntervalHub.startTimeout(() => triggerWinEndGame(world), winDelay);
}

/**
 * Triggers the win end screen if the world is still active.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function triggerWinEndGame(world) {
    if (world.isStopped) return;
    if (typeof window.endGame === "function") window.endGame("win");
}

/**
 * Processes one enemy collision with the character.
 * @param {import("../world.class.js").World} world
 * @param {import("../movable-object.class.js").MovableObject} enemy
 * @returns {void}
 */
export function handleEnemyCollision(world, enemy) {
    if (enemy.isDying) return;
    if (!world.character.isCollidingOffset(enemy)) return;
    if (world.isStompCollision(enemy)) return handleStomp(world, enemy);
    handleCharacterDamage(world, enemy);
}

/**
 * Applies stomp behavior after a valid stomp hit.
 * @param {import("../world.class.js").World} world
 * @param {import("../movable-object.class.js").MovableObject} enemy
 * @returns {void}
 */
export function handleStomp(world, enemy) {
    enemy.dead();
    world.character.currentImage = 0;
    world.character.speedY = 15;
}

/**
 * Applies damage to the character after an enemy hit.
 * @param {import("../world.class.js").World} world
 * @param {import("../movable-object.class.js").MovableObject} enemy
 * @returns {void}
 */
export function handleCharacterDamage(world, enemy) {
    if (world.character.isAboveGround() || world.character.speedY > 0) return;
    const tookDamage = world.character.hit(enemy);
    if (tookDamage) world.StatusBarHealth.setPercentage(world.character.energy);
}

/**
 * Removes enemies marked for cleanup.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function removeMarkedEnemies(world) {
    world.level.enemies = world.level.enemies.filter((enemy) => !enemy.markedForRemoval);
}

/**
 * Processes a bottle collision against one enemy.
 * @param {import("../world.class.js").World} world
 * @param {ThrowableObject} bottle
 * @param {import("../movable-object.class.js").MovableObject} enemy
 * @returns {void}
 */
export function handleBottleEnemyCollision(world, bottle, enemy) {
    if (bottle.markedForRemoval || bottle.isSplashing) return;
    if (enemy.isDying) return;
    if (!bottle.isCollidingOffset(enemy)) return;
    applyBottleDamage(enemy);
    SoundHub.playOne(SoundHub.throwable.sound);
    bottle.splash();
}

/**
 * Applies bottle damage to one enemy.
 * @param {import("../movable-object.class.js").MovableObject} enemy
 * @returns {void}
 */
export function applyBottleDamage(enemy) {
    if (enemy.isEndboss && typeof enemy.hit === "function") {
        enemy.hit(20);
        return;
    }

    if (typeof enemy.dead === "function") enemy.dead();
}

/**
 * Removes bottles marked for cleanup.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function removeMarkedBottles(world) {
    world.throwableObjects = world.throwableObjects.filter((bottle) => !bottle.markedForRemoval);
}

/**
 * Returns whether a bottle can currently be thrown.
 * @param {import("../world.class.js").World} world
 * @returns {boolean}
 */
export function canThrowBottle(world) {
    if (!world.keyboard.THROW) return false;
    if (!world.throwReady) return false;
    return world.bottlesCollected > 0;
}

/**
 * Creates one throwable bottle.
 * @param {import("../world.class.js").World} world
 * @returns {ThrowableObject}
 */
export function createThrowableBottle(world) {
    const throwToLeft = world.character.otherDirection;
    const bottleStartX = throwToLeft ? world.character.x - 20 : world.character.x + 100;
    return new ThrowableObject(bottleStartX, world.character.y + 100, throwToLeft);
}

/**
 * Consumes one bottle and updates the status bar.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function consumeBottle(world) {
    world.bottlesCollected--;
    world.StatusBarBottles.throwBottle();
}

/**
 * Starts the throw cooldown timer.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function startThrowCooldown(world) {
    world.throwReady = false;
    IntervalHub.startTimeout(() => world.throwReady = true, world.THROW_COOLDOWN_MS);
}

/**
 * Collects one coin if the character touches it.
 * @param {import("../world.class.js").World} world
 * @param {import("../coin.class.js").Coins} coin
 * @returns {void}
 */
export function collectCoinIfColliding(world, coin) {
    if (!world.character.isCollidingOffset(coin)) return;
    world.coinCollected++;
    world.StatusBarCoins.collectCoin();
    SoundHub.playOne(SoundHub.collect.sound);
    coin.markedForRemoval = true;
}

/**
 * Collects one bottle if the character touches it.
 * @param {import("../world.class.js").World} world
 * @param {import("../bottle.class.js").Bottle} bottle
 * @returns {void}
 */
export function collectBottleIfColliding(world, bottle) {
    if (!world.character.isCollidingOffset(bottle)) return;
    world.bottlesCollected++;
    world.StatusBarBottles.collectBottle();
    SoundHub.playOne(SoundHub.collect.sound);
    bottle.markedForRemoval = true;
}

/**
 * Activates the endboss when the character reaches the trigger area.
 * @param {import("../world.class.js").World} world
 * @param {import("../movable-object.class.js").MovableObject} enemy
 * @returns {void}
 */
export function activateEndbossIfNeeded(world, enemy) {
    if (!enemy.isEndboss) return;
    if (enemy.isActive) return;
    if (world.character.x <= 1000) return;
    enemy.activate();
    SoundHub.playOne(SoundHub.endboss.entry);
}
