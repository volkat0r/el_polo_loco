import { ImageHub } from "../imagehub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

/**
 * Player health status bar UI.
 */
export class StatusBarHealth extends DrawableObject{
    percentage = 100;
    imageCache = {};

    // Image Hub
    IMAGES_STATUS_HEALTH = ImageHub.status_bar.status_health;

    /**
     * Creates health status bar.
     */
    constructor(){
        super();
        this.loadImages(this.IMAGES_STATUS_HEALTH);
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }
    
    /**
     * Sets bar value and image.
     * @param {number} percentage
     * @returns {void}
     */
    setPercentage(percentage){
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES_STATUS_HEALTH[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Resolves image index for current percentage.
     * @returns {number}
     */
    resolveImageIndex() {
        if (this.percentage == 100){
            return 5;
        } else if(this.percentage >= 80){
            return 4;
        } else if(this.percentage >= 60){
            return 3;
        } else if(this.percentage >= 40){
            return 2;
        } else if(this.percentage >= 20){
            return 1;
        } else {
            return 0;
        }
    }

}