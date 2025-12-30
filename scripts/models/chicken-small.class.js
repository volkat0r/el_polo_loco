import { IntervallHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class ChickenSmall extends MovableObject{
    y = 370;
    width = 45;
    height = 45;
    
    // Image Hub
    CHICKEN_WALK = ImageHub.chicken_small.walk;
    CHICKEN_DEAD = ImageHub.chicken_small.dead;

    constructor(){
        super();
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.CHICKEN_WALK[0]);
        this.loadImages(this.CHICKEN_WALK);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random() * 1;
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