import { IntervalHub } from "../intervalhub.class.js";
import { createLevel1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Endboss } from "./endboss.class.js";
import { StatusBarHealth } from "./statusbar-health.class.js";
import { StatusBarBottles } from "./statusbar-bottles.class.js";
import { StatusBarCoins } from "./statusbar-coins.class.js";
import { StatusBarEndboss } from "./statusbar-endboss.class.js";
import { ThrowableObject } from "./throwable-object.class.js";
import { SoundHub } from "../soundhub.class.js";

export class World {
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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.initEndboss(); /* ? */
        this.setWorld();
        this.play();
        this.draw();
    }

    // add endboss + healthbar to the world
    initEndboss() {
        this.endboss = new Endboss();
        this.level.enemies.push(this.endboss);
        this.StatusBarEndboss = new StatusBarEndboss(this.endboss);
    }

    /* initialize world = this */
    setWorld() {
        this.character.world = this;
        if (this.endboss) {
            this.endboss.world = this;
        }
    }

    play() {
        IntervalHub.startInterval(this.checkCollision, 1000 / 60);
        IntervalHub.startInterval(this.checkThrowObjects, 1000 / 60);
        IntervalHub.startInterval(this.checkBottleHit, 1000 / 60);
        IntervalHub.startInterval(this.checkCoinCollection, 1000 / 60);
        IntervalHub.startInterval(this.checkBottleCollection, 1000 / 60);
        IntervalHub.startInterval(this.checkEndbossActivation, 1000 / 60);
        IntervalHub.startInterval(this.checkEndConditions, 1000 / 20);
    }

    checkEndConditions = () => {
        if (this.isStopped) return;

        if (this.character.isDead()) {
            if (typeof window.endGame === "function") {
                window.endGame("lose");
            }
            return;
        }

        if (this.endboss && this.endboss.isDying) {
            if (typeof window.endGame === "function") {
                window.endGame("win");
            }
        }
    };

    /* collision */
    checkCollision = () => {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDying) return;
            if (this.character.isCollidingOffset(enemy)){
                if (this.isStompCollision(enemy)) {
                    enemy.dead();
                    this.character.speedY = 15;
                } else {
                    const tookDamage = this.character.hit(enemy);
                    if (tookDamage) {
                        this.StatusBarHealth.setPercentage(this.character.energy);
                    }
                }
            }
        });

        this.level.enemies = this.level.enemies.filter(
            enemy => !enemy.markedForRemoval
        );
    };

    isStompCollision(enemy) {
        if (!this.character.isAboveGround()) return false;
        if (this.character.speedY > 0) return false;

        const characterBottom = this.character.y + this.character.height - this.character.offset.bottom;
        const enemyTop = enemy.y + enemy.offset.top;

        return characterBottom <= enemyTop + 30;
    }

    checkBottleHit = () => {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (bottle.markedForRemoval) return;
                if (enemy.isDying) return;
                if (!bottle.isCollidingOffset(enemy)) return;

                if (enemy.isEndboss && typeof enemy.hit === "function") {
                    enemy.hit(5);
                } else if (typeof enemy.dead === "function") {
                    enemy.dead();
                }

                SoundHub.playOne(SoundHub.throwable.sound);
                bottle.markedForRemoval = true;
            });
        });

        this.throwableObjects = this.throwableObjects.filter(
            bottle => !bottle.markedForRemoval
        );
    };

    /* Throw bottles */
    checkThrowObjects = () => {
        if (!this.keyboard.THROW) return;
        if (!this.throwReady || this.bottlesCollected <= 0) return;

        const throwToLeft = this.character.otherDirection;
        const bottleStartX = throwToLeft ? this.character.x - 20 : this.character.x + 100;

        const bottle = new ThrowableObject(
            bottleStartX,
            this.character.y + 100,
            throwToLeft
        );

        this.throwableObjects.push(bottle);
        this.bottlesCollected--;
        this.StatusBarBottles.throwBottle();

        this.throwReady = false;
        IntervalHub.startTimeout(() => this.throwReady = true, 500);
    };

    /* collect items */
    checkCoinCollection = () => {
        this.level.coins.forEach(coin => {
            if (this.character.isCollidingOffset(coin)) {
                this.coinCollected++;
                this.StatusBarCoins.collectCoin();
                SoundHub.playOne(SoundHub.collect.sound);
                coin.markedForRemoval = true;
            }
        });

        this.level.coins = this.level.coins.filter(
            coin => !coin.markedForRemoval
        );
    };

    checkBottleCollection = () => {
        if (this.bottlesCollected >= 5) return;

        this.level.bottles.forEach(bottle => {
            if (this.character.isCollidingOffset(bottle)) {
                this.bottlesCollected++;
                this.StatusBarBottles.collectBottle();
                SoundHub.playOne(SoundHub.collect.sound);
                bottle.markedForRemoval = true;
            }
        });

        this.level.bottles = this.level.bottles.filter(
            bottle => !bottle.markedForRemoval
        );
    };

    /* activate enbdoss */
    checkEndbossActivation = () => {
        this.level.enemies.forEach(enemy => {
            if (!enemy.isEndboss) return;
            if (enemy.isActive) return;

            if (this.character.x > 1000) {
                enemy.activate();
                SoundHub.playOne(SoundHub.endboss.entry);
            }
        });
    };

    /* draw objects into world */
    draw() {
        if (this.isStopped) return;

        this.cameraUpdate();
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addObjectsToMap(this.level.coins);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        this.StatusBarEndboss.update();
        this.addToMap(this.StatusBarEndboss);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.StatusBarHealth);
        this.addToMap(this.StatusBarBottles);
        this.addToMap(this.StatusBarCoins);

        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    stop() {
        if (this.isStopped) return;

        this.isStopped = true;
        IntervalHub.clearAll();

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    cameraUpdate() {
        this.camera_x = -this.character.x + 100;
        this.camera_x = Math.min(0, this.camera_x);
        this.camera_x = Math.max(this.camera_x, -this.level.level_end_x);
    }

    addObjectsToMap(objects) {
        if (!objects) return;
        objects.forEach(obj => this.addToMap(obj));
    }

    addToMap(mo) {
        if (mo.otherDirection) this.flipImage(mo);
        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        mo.drawOffsetFrame(this.ctx);
        if (mo.otherDirection) this.flipImageBack(mo);
    }

    flipImage(mo){
        this.ctx.save();
        this.ctx.translate(mo.width, 0);
        this.ctx.scale(-1, 1);
        mo.x = mo.x * -1;
    }

    flipImageBack(mo){
        mo.x = mo.x * -1;
        this.ctx.restore();
    }
}
