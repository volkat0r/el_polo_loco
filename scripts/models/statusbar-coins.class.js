import { ImageHub } from "../imagehub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

export class StatusBarCoins extends DrawableObject{
    percentage;
    imageCache = {};

    // Image Hub
    IMAGES_STATUS_COINS = ImageHub.status_bar.status_coin;

    constructor(){
        super();
        this.loadImages(this.IMAGES_STATUS_COINS);
        this.x = 20;
        this.y = 100;
        this.width = 200;
        this.height = 60;
        this.setPercentage(0);
    }
    
    setPercentage(percentage){
        this.percentage = Math.max(0, Math.min(100, percentage));
        let path = this.IMAGES_STATUS_COINS[this.resolveImageIndex()];
        this.img = this.imageCache[path];
    }

    collectCoin() {
        this.percentage += 20;
        this.percentage = Math.min(100, this.percentage);
        this.setPercentage(this.percentage);
    }

    resolveImageIndex() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }

}