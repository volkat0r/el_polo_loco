import { ImageHub } from "../imagehub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

/**
 * Coin status bar UI.
 */
export class StatusBarCoins extends DrawableObject{
    percentage;
    totalCoins = 0;
    collectedCoins = 0;
    imageCache = {};

    // Image Hub
    IMAGES_STATUS_COINS = ImageHub.status_bar.status_coin;

    /**
     * Creates coin status bar.
     */
    constructor(){
        super();
        this.loadImages(this.IMAGES_STATUS_COINS);
        this.x = 20;
        this.y = 100;
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
        let path = this.IMAGES_STATUS_COINS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    /**
     * Configures how many coins are available in the current level.
     * @param {number} totalCoins
     * @returns {void}
     */
    setTotalCoins(totalCoins) {
        this.totalCoins = Math.max(0, totalCoins);
        this.collectedCoins = 0;
        this.updateByCollectedCoins();
    }

    /**
     * Increases collected coin counter by one and updates the bar.
     * @returns {void}
     */
    collectCoin() {
        this.collectedCoins += 1;
        this.collectedCoins = Math.min(this.collectedCoins, this.totalCoins);
        this.updateByCollectedCoins();
    }

    /**
     * Converts collected coins to percent and refreshes the bar.
     * @returns {void}
     */
    updateByCollectedCoins() {
        if (this.totalCoins <= 0) {
            this.setPercentage(0);
            return;
        }

        const percentage = (this.collectedCoins / this.totalCoins) * 100;
        this.setPercentage(percentage);
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