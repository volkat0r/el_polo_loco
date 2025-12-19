import {MovableObject} from "./movable-object.class.js";
import {ImageHub} from "../imagehub.class.js";
import {IntervallHub} from "../intervalhub.class.js";

export class Chicken extends MovableObject{
    y = 360;
    width = 70;
    height = 55;
    
    // Image Hub
    CHICKEN_WALK = ImageHub.chicken_normal.walk;
    CHICKEN_DEAD = ImageHub.chicken_normal.dead;

    constructor(){
        super();
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.CHICKEN_WALK[0]);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 1;
        this.loadImages(this.CHICKEN_WALK);
        this.animate();
        this.offset = {
            left: 0,
            right: 0,
            top: 0,
            bottom: 0
        };
    }

    animate(){
        IntervallHub.startInterval(this.selectAnimation, 1000 / 200);
        IntervallHub.startInterval(this.moveLeft, 1000 / 60);
    }

    selectAnimation = () => {
        this.playAnimation(this.CHICKEN_WALK);
    }

    moveLeft(){
        this.otherDirection = false;
    }
}