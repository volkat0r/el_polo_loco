import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Coins extends MovableObject {
    height = 100;
    width = 100;

    // Image Hub
    IMAGES_COIN = ImageHub.coin.coin;

    constructor(){
        super();

        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.IMAGES_COIN[0]);
        this.loadImages(this.IMAGES_COIN);
        this.x = 200 + Math.random() * 1500;
        this.y = 150 + Math.random() * 100;
        this.collected = false;
        this.animate();
        this.offset = {left: 35, right: 35, top: 35, bottom: 35};
    }

    animate() {
        IntervalHub.startInterval(this.animateCoin, 300);
    }

    animateCoin = () => {
        let i = this.currentImage % this.IMAGES_COIN.length;
        let path = this.IMAGES_COIN[i];
        this.img = this.imageCache[path];
        this.currentImage++;
    };
}