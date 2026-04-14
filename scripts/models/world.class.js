import { IntervalHub } from "../intervalhub.class.js";
import { createLevel1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Endboss } from "./endboss.class.js";
import { StatusBarHealth } from "./statusbar-health.class.js";
import { StatusBarBottles } from "./statusbar-bottles.class.js";
import { StatusBarCoins } from "./statusbar-coins.class.js";
import { StatusBarEndboss } from "./statusbar-endboss.class.js";
import {
    activateEndbossIfNeeded,
    canThrowBottle,
    collectBottleIfColliding,
    collectCoinIfColliding,
    consumeBottle,
    createThrowableBottle,
    handleBottleEnemyCollision,
    handleEnemyCollision,
    handleLoseCondition,
    handleWinCondition,
    removeMarkedBottles,
    removeMarkedEnemies,
    startThrowCooldown
} from "./world/world-gameplay.js";
import { drawStatusBars, drawWorldObjects, prepareFrame } from "./world/world-renderer.js";

export class World {
    THROW_COOLDOWN_MS = 900;
    ctx;
    keyboard;
    level = createLevel1();
    character = new Character();
    StatusBarHealth = new StatusBarHealth();
    StatusBarBottles = new StatusBarBottles();
    StatusBarCoins = new StatusBarCoins();
    StatusBarEndboss;
    throwableObjects = [];
    coinCollected = 0;
    bottlesCollected = 0;
    throwReady = true;
    camera_x = 0;
    animationFrameId = null;
    isStopped = false;
    loseSequenceStarted = false;
    winSequenceStarted = false;

    /**
     * Creates the world and starts gameplay loops.
     * @param {HTMLCanvasElement} canvas
     * @param {import("./keyboard.class.js").Keyboard} keyboard
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initEndboss();
        this.StatusBarCoins.setTotalCoins(this.level.coins?.length ?? 0);
        this.setWorld();
        this.play();
        this.draw();
    }

    /**
     * Adds endboss and endboss status bar.
     * @returns {void}
     */
    initEndboss() {
        this.endboss = new Endboss();
        this.level.enemies.push(this.endboss);
        this.StatusBarEndboss = new StatusBarEndboss(this.endboss);
    }

    /**
     * Links world reference to character and endboss.
     * @returns {void}
     */
    setWorld() {
        this.character.world = this;
        if (this.endboss) {
            this.endboss.world = this;
        }
    }

    /**
     * Starts all gameplay check intervals.
     * @returns {void}
     */
    play() {
        IntervalHub.startInterval(this.checkCollision, 1000 / 60);
        IntervalHub.startInterval(this.checkThrowObjects, 1000 / 60);
        IntervalHub.startInterval(this.checkBottleHit, 1000 / 60);
        IntervalHub.startInterval(this.checkCoinCollection, 1000 / 60);
        IntervalHub.startInterval(this.checkBottleCollection, 1000 / 60);
        IntervalHub.startInterval(this.checkEndbossActivation, 1000 / 60);
        IntervalHub.startInterval(this.checkEndConditions, 1000 / 20);
    }

    /**
     * Checks lose/win conditions and triggers end screen.
     * @returns {void}
     */
    checkEndConditions = () => {
        if (this.isStopped) return;
        if (handleLoseCondition(this)) return;
        handleWinCondition(this);
    };

    /**
     * Checks character collisions with enemies.
     * @returns {void}
     */
    checkCollision = () => {
        this.level.enemies.forEach(enemy => handleEnemyCollision(this, enemy));
        removeMarkedEnemies(this);
    }

    /**
     * Checks if a collision is a valid stomp hit.
     * @param {import("./movable-object.class.js").MovableObject} enemy
     * @returns {boolean}
     */
    isStompCollision(enemy) {
        if (!this.character.isAboveGround()) return false;
        if (this.character.speedY > 0) return false;

        const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;

        return characterBottom <= enemyTop + 30;
    }

    /**
     * Checks if thrown bottles hit enemies.
     * @returns {void}
     */
    checkBottleHit = () => {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => handleBottleEnemyCollision(this, bottle, enemy));
        });
        removeMarkedBottles(this);
    }

    /**
     * Throws a bottle when input and cooldown allow it.
     * @returns {void}
     */
    checkThrowObjects = () => {
        if (!canThrowBottle(this)) return;
        this.throwableObjects.push(createThrowableBottle(this));
        consumeBottle(this);
        startThrowCooldown(this);
    }

    /**
     * Checks coin pickups and updates coin bar.
     * @returns {void}
     */
    checkCoinCollection = () => {
        this.level.coins.forEach(coin => collectCoinIfColliding(this, coin));
        this.level.coins = this.level.coins.filter(coin => !coin.markedForRemoval);
    };

    /**
     * Checks bottle pickups and updates bottle bar.
     * @returns {void}
     */
    checkBottleCollection = () => {
        if (this.bottlesCollected >= 5) return;
        this.level.bottles.forEach(bottle => collectBottleIfColliding(this, bottle));
        this.level.bottles = this.level.bottles.filter(bottle => !bottle.markedForRemoval);
    }

    /**
     * Activates endboss when character reaches trigger area.
     * @returns {void}
     */
    checkEndbossActivation = () => {
        this.level.enemies.forEach(enemy => activateEndbossIfNeeded(this, enemy));
    };

    /**
     * Draws world objects and schedules next frame.
     * @returns {void}
     */
    draw() {
        if (this.isStopped) return;
        prepareFrame(this);
        drawWorldObjects(this);
        drawStatusBars(this);
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Stops all world updates and animation frame.
     * @returns {void}
     */
    stop() {
        if (this.isStopped) return;

        this.isStopped = true;
        IntervalHub.clearAll();

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    /**
     * Updates camera position within level bounds.
     * @returns {void}
     */
    cameraUpdate() {
        this.camera_x = -this.character.x + 100;
        this.camera_x = Math.min(0, this.camera_x);
        this.camera_x = Math.max(this.camera_x, -this.level.level_end_x);
    }
}
