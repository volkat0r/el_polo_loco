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
    level = level1;
    coinCollected = 0;
    bottlesCollected = 0;
    character = new Character();
    StatusBarHealth = new StatusBarHealth();
    StatusBarBottles = new StatusBarBottles();
    StatusBarCoins = new StatusBarCoins();
    throwableObjects = [new ThrowableObject()];
    camera_x = 0;
    throwReady;


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
        IntervalHub.startInterval(this.checkCollision, 1000 / 10);
        IntervalHub.startInterval(this.checkThrowObjects, 60);
        IntervalHub.startInterval(this.checkCoinCollection, 60);
        IntervalHub.startInterval(this.checkBottleCollection, 60);
    }

    
    checkCollision = () => {
        this.level.enemies.forEach(enemy => {
            if (!this.character.isCollidingOffset(enemy)) return;
            if (this.character.isCollidingOffset(enemy) && this.character.isAboveGround()){
                if (this.character.speedY < 0){
                    enemy.dead();
                    this.character.speedY = 15;
                }
            } else {
                this.character.hit(enemy);
                this.StatusBarHealth.setPercentage(this.character.energy);
            }
        });
        this.level.enemies = this.level.enemies.filter(
            enemy => !enemy.markedForRemoval
        );
    };

    checkCollisionEndBoss = () => {
        
    }

    checkThrowObjects = () => {
        if (this.keyboard.THROW && this.bottlesCollected > 0){
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100, this.character.otherDirection);
            this.throwableObjects.push(bottle);

            // healthbar & amount bottles
            this.bottlesCollected--;
            this.throwReady = false;
            console.log("bottle " + this.bottlesCollected);
            
            // IntervalHub.startTimeout(() => {this.throwReady = true;}, 1000);
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
        // console.log("coins" + this.coinCollected);

        this.level.coins = this.level.coins.filter(
            coin => !coin.markedForRemoval
        );
    }

    checkBottleCollection = () => {
        if (this.bottlesCollected <= 4){
            this.level.bottles.forEach((bottle) => {
                if (this.character.isCollidingOffset(bottle)) {
                    this.bottlesCollected++,
                    this.StatusBarBottles.collectBottle();
                    bottle.markedForRemoval = true;
                }
            });
        }

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