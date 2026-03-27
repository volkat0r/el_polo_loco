import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

/**
 * Collectable coin object.
 */
export class Coins extends MovableObject {
    height = 100;
    width = 100;

    // Image Hub
    IMAGES_COIN = ImageHub.coin.coin;

    /**
     * Creates one coin with random position.
     */
    constructor(){
        super();

        this.showFrame = false;
        this.showOffsetFrame = false;
        this.loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = 200 + Math.random() * 1500;
        this.y = 150 + Math.random() * 100;
        this.collected = false;
        this.animate();
        this.offset = {left: 35, right: 35, top: 35, bottom: 35};
    }

    /**
     * Starts coin animation loop.
     * @returns {void}
     */
    animate() {
        IntervalHub.startInterval(this.animateCoin, 300);
    }

    /**
     * Switches to next coin image frame.
     * @returns {void}
     */
    animateCoin = () => {
        let i = this.currentImage % this.IMAGES_COIN.length;
        let path = this.IMAGES_COIN[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    };
}