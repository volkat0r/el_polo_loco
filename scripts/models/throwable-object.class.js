import { IntervalHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class ThrowableObject extends MovableObject {
    // Image Hub
    BOTTLE_ON_GROUND = ImageHub.salsa_bottle.bottle_on_ground;
    BOTTEL_ROTATION = ImageHub.salsa_bottle.bottle_rotation;
    BOTTLE_SPLASH = ImageHub.salsa_bottle.bottle_splash;

    constructor(x, y, throwToLeft = false){
        super();
        this.loadImage(this.BOTTEL_ROTATION[0]);
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
    }

    throw(){
        this.speedY = 30;
        this.applyGravity();
    }

    throwBottle = () => {
        this.x += 10 * this.throwDirection;
    }

    isAboveGround(){
        return true;
    }
}