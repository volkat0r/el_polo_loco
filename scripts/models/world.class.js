import { IntervalHub } from "../intervalhub.class.js";
import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { StatusBarHealth } from "./statusbar-health.class.js";
import { StatusBarBottles } from "./statusbar-bottles.class.js";
import { StatusBarCoins } from "./statusbar-coins.class.js";
import { ThrowableObject } from "./throwable-object.class.js";

export class World{
    ctx;
    keyboard;
    backgroundObjects = level1.backgroundObjects;
    level = level1;
    enemies = level1.enemies;
    coin = level1.coin;
    bottle = level1.bottle;
    clouds = level1.clouds;
    coinCollected = 0;
    bottlesCollected = 0;
    character = new Character();
    StatusBarHealth = new StatusBarHealth();
    StatusBarBottles = new StatusBarBottles();
    StatusBarCoins = new StatusBarCoins();
    throwableObjects = [new ThrowableObject()];
    camera_x = 0;


    constructor(canvas, keyboard){
        this.ctx = canvas.getContext("2d");
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.play();
    }

    setWorld(){
        this.character.world = this;
    }

    play(){
        IntervalHub.startInterval(this.checkCollision, 1000 / 60);
        IntervalHub.startInterval(this.checkThrowObjects, 60);
        IntervalHub.startInterval(this.checkCoinCollection, 60);
        IntervalHub.startInterval(this.checkBottleCollection, 60);
    }

    
    checkCollision = () => {
        this.level.enemies.forEach(enemy => {
            if (enemy.isDying || enemy.isDead?.()) return;
            if (!this.character.isCollidingOffset(enemy)) return;

            const characterBottom = this.character.y + this.character.height;
            const isJumpAttack = enemy.isJumpable?.() && this.character.speedY < 0 && characterBottom < enemy.y + enemy.height / 2;
            if (isJumpAttack) {
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

    checkThrowObjects = () => {

        if (!this.bottlesCollected <= 4){
            if (this.keyboard.THROW){
                this.bottlesCollected--;
                let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
                this.throwableObjects.push(bottle);
            }
        }
    }

    checkCoinCollection = () => {
        this.level.coins.forEach((coin) => {
            if (this.character.isCollidingOffset(coin)) {
                this.coinCollected++,
                this.StatusBarCoins.collectCoin();
                coin.markedForRemoval = true;
            }
        });
        // collected 5 coins full healthbar
        console.log("coins" + this.coinCollected);

        this.level.coins = this.level.coins.filter(
            coin => !coin.markedForRemoval
        );
    }

    checkBottleCollection = () => {
        if (this.bottlesCollected <= 5){
            this.level.bottles.forEach((bottle) => {
                if (this.character.isCollidingOffset(bottle)) {
                    this.bottlesCollected++,
                    this.StatusBarBottles.collectBottle();
                    bottle.markedForRemoval = true;
                }
            });
        }
        console.log("bottles " + this.bottlesCollected);

        this.level.bottles = this.level.bottles.filter(
            bottle => !bottle.markedForRemoval
        );
    }

    draw(){
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

        // UI fixieren
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.StatusBarHealth);
        this.addToMap(this.StatusBarBottles);
        this.addToMap(this.StatusBarCoins);
        this.ctx.translate(this.camera_x, 0);

        this.ctx.translate(-this.camera_x, 0);
        requestAnimationFrame(() => this.draw());
    }

    cameraUpdate(){
        this.camera_x = -this.character.x + 100;
        this.camera_x = Math.max(
            this.camera_x,
            -this.level.level_end_x
        );

        this.camera_x = Math.min(this.camera_x, 0);
    }

    addObjectsToMap(objects){
        if (!objects) return;

        objects.forEach(obj => {
            this.addToMap(obj);
        });
    }

    addToMap(mo){
        if(mo.otherDirection){
            this.flipImage(mo);
        }

        mo.draw(this.ctx);
        mo.drawFrame(this.ctx);
        mo.drawOffsetFrame(this.ctx);

        if(mo.otherDirection){
            this.flipImageBack(mo);
        }
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