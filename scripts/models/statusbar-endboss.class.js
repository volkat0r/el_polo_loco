import { ImageHub } from "../imagehub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

/**
* Endboss health bar UI.
*/
export class StatusBarEndboss extends DrawableObject {
    percentage = 100;
    endboss;

    IMAGES_STATUS_ENDBOSS = ImageHub.status_bar.status_endboss;

    /**
    * Creates endboss status bar.
    * @param {import("./endboss.class.js").Endboss} endboss
    */
    constructor(endboss) {
        super();
        this.endboss = endboss;
        this.loadImages(this.IMAGES_STATUS_ENDBOSS);
        this.width = 200;
        this.height = 60;
        this.setPercentage(100);
    }

    /**
    * Updates bar position and value.
    * @returns {void}
    */
    update() {
        this.updatePosition();
        this.setPercentage(this.endboss.energy);
    }

    /**
    * Moves bar above the endboss.
    * @returns {void}
    */
    updatePosition() {
        this.x = this.endboss.x + 40;
        this.y = this.endboss.y - 40;
    }

    /**
    * Sets bar value and image.
    * @param {number} percentage
    * @returns {void}
    */
    setPercentage(percentage) {
        this.percentage = Math.max(0, Math.min(100, percentage));
        const path = this.IMAGES_STATUS_ENDBOSS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
    * Resolves image index for current percentage.
    * @returns {number}
    */
    resolveImageIndex() {
        if (this.percentage === 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}
