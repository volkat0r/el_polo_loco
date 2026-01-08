import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Cloud extends MovableObject{
    x = 50;
    y = 0;
    width = 600;
    height = 300;

    // Image Hub
    CLOUD = ImageHub.background.clouds;

    constructor(){
        super();
        this.loadImage(this.CLOUD[0], this.CLOUD[1]);
        this.x = Math.random() * 2400;
        this.animate();
    }

    animate(){
        IntervalHub.startInterval(this.moveLeft, 1000 / 60);
    }

}