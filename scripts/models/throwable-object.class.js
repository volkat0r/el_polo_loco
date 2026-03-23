import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class ThrowableObject extends MovableObject {
    // Image Hub
    BOTTLE_ON_GROUND = ImageHub.salsa_bottle.bottle_on_ground;
    BOTTEL_ROTATION = ImageHub.salsa_bottle.bottle_rotation;
    BOTTLE_SPLASH = ImageHub.salsa_bottle.bottle_splash;

    isSplashing = false;
    GROUND_Y = 360;

    constructor(x, y, throwToLeft = false){
        super();
        this.loadImage(this.BOTTEL_ROTATION[0]);
        this.loadImages(this.BOTTEL_ROTATION);
        this.loadImages(this.BOTTLE_SPLASH);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 110;
        this.throwDirection = throwToLeft ? -1 : 1;
        this.otherDirection = throwToLeft;
        this.throw();
        this.animate();

        this.offset = {
            left: 20,
            right: 20,
            top: 17,
            bottom: 9
        };
    }

    animate(){
        IntervalHub.startInterval(this.throwBottle, 1000 / 25);
        IntervalHub.startInterval(() => {
            if (this.isSplashing) {
                this.playAnimation(this.BOTTLE_SPLASH);}
            else {
                this.playAnimation(this.BOTTEL_ROTATION);
            }
        }, 1000 / 12);
    }

    throw(){
        this.speedY = 30;
        this.applyGravity();
    }

    throwBottle = () => {
        if (this.isSplashing) return;
        this.x += 10 * this.throwDirection;
        if (this.y + this.height >= this.GROUND_Y) {
            this.splash();
        }
    }

    splash() {
        if (this.isSplashing) return;
        this.isSplashing = true;
        this.throwDirection = 0;
        this.speedY = 0;
        this.currentImage = 0;
        IntervalHub.startTimeout(() => { this.markedForRemoval = true;}, 500);
    }

    isAboveGround(){
        return !this.isSplashing;
    }
}