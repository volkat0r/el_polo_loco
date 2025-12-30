import { IntervallHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { SoundHub } from "../soundhub.class.js";
import { MovableObject } from "./movable-object.class.js";


export class Endboss extends MovableObject{
    x = 700;
    y = 180;
    width = 304;
    height = 261;

    // Image Hub
    ENDBOSS_WALK = ImageHub.end_boss.walk;
    ENDBOSS_ALERT = ImageHub.end_boss.alert;
    ENDBOSS_ATTACK = ImageHub.end_boss.attack;
    ENDBOSS_HURT = ImageHub.end_boss.hurt;
    ENDBOSS_DEAD = ImageHub.end_boss.dead;
    // Sound Hub
    SOUND_ENTRY = SoundHub.endboss.entry;

    constructor(){
        super();
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.ENDBOSS_ALERT[0]);
        this.x = 700;
        this.speed = 0.15 + Math.random() * 1;
        this.loadImages(this.ENDBOSS_ALERT);
        this.animate();

        this.offset = {
            left: 10,
            right: 10,
            top: 30,
            bottom: 15
        };
    }


    animate(){
        IntervallHub.startInterval(this.selectAnimation, 400);
    }
    
    selectAnimation = () => {
        const index = this.currentImage % this.ENDBOSS_ALERT.length;
        let path = this.ENDBOSS_ALERT[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }
}