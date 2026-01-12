import { IntervalHub } from "../intervalhub.class.js";
import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { Endboss } from "./endboss.class.js";
import { StatusBarHealth } from "./statusbar-health.class.js";
import { StatusBarBottles } from "./statusbar-bottles.class.js";
import { StatusBarCoins } from "./statusbar-coins.class.js";
import { StatusBarEndboss } from "./statusbar-endboss.class.js";
import { ThrowableObject } from "./throwable-object.class.js";

export class World {
    ctx;
    keyboard;
    level = level1;

    character = new Character();
    endboss;

    StatusBarHealth = new StatusBarHealth();
    StatusBarBottles = new StatusBarBottles();
    StatusBarCoins = new StatusBarCoins();
    StatusBarEndboss;

    throwableObjects = [];

    coinCollected = 0;
    bottlesCollected = 0;
    throwReady = true;

    camera_x = 0;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.initEndboss();
        this.setWorld();
        this.play();
        this.draw();
    }

    initEndboss() {
        this.endboss = new Endboss();
        this.level.enemies.push(this.endboss);
        this.StatusBarEndboss = new StatusBarEndboss(this.endboss);
    }

    setWorld() {
        this.character.world = this;
    }

    play() {
        IntervalHub.startInterval(this.checkCollision, 1000 / 60);
        IntervalHub.startInterval(this.checkThrowObjects, 1000 / 60);
        IntervalHub.startInterval(this.checkBottleHit, 1000 / 60);
        IntervalHub.startInterval(this.checkCoinCollection, 1000 / 60);
        IntervalHub.startInterval(this.checkBottleCollection, 1000 / 60);
    }

    /* collision */

    checkCollision = () => {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDying) return;
            if (!this.character.isCollidingOffset(enemy)) return;

            if (this.character.speedY < 0 && this.character.isAboveGround()) {
                enemy.dead();
                this.character.speedY = 15;
            } else {
                this.character.hit(enemy);
                this.StatusBarHealth.setPercentage(this.character.energy);
            }
        });

        this.level.enemies = this.level.enemies.filter(
            enemy => !enemy.markedForRemoval
        );
    };

    checkBottleHit = () => {
        this.throwableObjects.forEach(bottle => {
            this.level.enemies.forEach(enemy => {
                if (!enemy.isEndboss) return;
                if (!bottle.isCollidingOffset(enemy)) return;

                enemy.hit(20);
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

        const bottle = new ThrowableObject(
            this.character.x + 100,
            this.character.y + 100,
            this.character.otherDirection
        );

        this.throwableObjects.push(bottle);
        this.bottlesCollected--;
        this.StatusBarBottles.throwBottle();

        this.throwReady = false;
        IntervalHub.startTimeout(() => this.throwReady = true, 500);
    };

    /* collect items*/

    checkCoinCollection = () => {
        this.level.coins.forEach(coin => {
            if (this.character.isCollidingOffset(coin)) {
                this.coinCollected++;
                this.StatusBarCoins.collectCoin();
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
                bottle.markedForRemoval = true;
            }
        });

        this.level.bottles = this.level.bottles.filter(
            bottle => !bottle.markedForRemoval
        );
    };

    /* draw objects to world */

    draw() {
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

        requestAnimationFrame(() => this.draw());
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
