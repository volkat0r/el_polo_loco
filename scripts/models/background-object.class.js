import { MovableObject } from "./movable-object.class.js";

/**
 * Static background segment used to build the scrollable-effect (parallax).
 */
export class BackgroundObject extends MovableObject{
    width = 720;
    height = 480;
    
    /**
     * Creates a background object with fixed layer size and bottom alignment.
     * @param {string} imagePath Path to the background layer image.
     * @param {number} x Horizontal world position.
     */
    constructor(imagePath, x){
        super().loadImage(imagePath);

        this.x = x;
        this.y = 480 - this.height;
    }
}