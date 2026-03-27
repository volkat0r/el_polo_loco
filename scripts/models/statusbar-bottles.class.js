import { ImageHub } from "../imagehub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

/**
 * Bottle status bar UI.
 */
export class StatusBarBottles extends DrawableObject{
    percentage = 100;
    imageCache = {};

    // Image Hub
    IMAGES_STATUS_BOTTLES = ImageHub.status_bar.status_bottle;

    /**
     * Creates bottle status bar.
     */
    constructor(){
        super();
        this.loadImages(this.IMAGES_STATUS_BOTTLES);
        this.x = 20;
        this.y = 50;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }
    
    /**
     * Sets bar value and image.
     * @param {number} percentage
     * @returns {void}
     */
    setPercentage(percentage){
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES_STATUS_BOTTLES[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Increases bottle bar by 20.
     * @returns {void}
     */
    collectBottle() {
        this.percentage += 20;
        this.percentage = Math.min(100, this.percentage);
        this.setPercentage(this.percentage);
    }

    /**
     * Decreases bottle bar by 20.
     * @returns {void}
     */
    throwBottle() {
        this.percentage -= 20;
        this.percentage = Math.max(0, this.percentage);
        this.setPercentage(this.percentage);
    }

    /**
     * Resolves image index for current percentage.
     * @returns {number}
     */
    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }

}