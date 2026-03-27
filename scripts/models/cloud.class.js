import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

/**
 * Moving cloud background object.
 */
export class Cloud extends MovableObject{
    x = 50;
    y = 0;
    width = 600;
    height = 300;

    // Image Hub
    CLOUD = ImageHub.background.clouds;

    /**
     * Creates one cloud with random x position.
     */
    constructor(){
        super();
        this.loadImage(this.CLOUD[0], this.CLOUD[1]);
        this.x = Math.random() * 2400;
        this.animate();
    }

    /**
     * Starts cloud movement loop.
     * @returns {void}
     */
    animate(){
        IntervalHub.startInterval(this.moveLeft, 1000 / 60);
    }

}