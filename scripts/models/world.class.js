import { IntervallHub } from "../intervalhub.class.js";
import { level1 } from "../levels/level1.js";
import { Character } from "./character.class.js";
import { StatusBar } from "./status-bar.class.js";
import { ThrowableObject } from "./throwable-object.class.js";

export class World{
    backgroundObjects = level1.backgroundObjects;
    level = level1;
    enemies = level1.enemies;
    clouds = level1.clouds;
    character = new Character();
    statusBar = new StatusBar();
    throwableObjects = [new ThrowableObject()];
    ctx;
    keyboard;
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
        IntervallHub.startInterval(this.checkCollision, 60);
        IntervallHub.startInterval(this.checkThrowObjects, 60);
    }

    checkCollision = () => {
        this.level.enemies.forEach(enemy => {
            if (this.character.isCollidingOffset(enemy)){
                this.character.hit(enemy);
                this.statusBar.setPercentage(this.character.energy);
            }
        });
    }

    checkThrowObjects = () => {
        if (this.keyboard.THROW){
            let bottle = new ThrowableObject(this.character.x + 100, this.character.y + 100);
            this.throwableObjects.push(bottle);
        }
    }

    draw(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.throwableObjects);
        this.addToMap(this.character);

        // fixed position objects within viewport
        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0);

        this.ctx.translate(-this.camera_x, 0);
        let self = this;
        requestAnimationFrame(function() {
            self.draw();
        });
    }

    addObjectsToMap(objects){
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