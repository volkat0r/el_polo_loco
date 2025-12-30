import { IntervallHub } from "../intervalhub.class.js";
import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class ThrowableObject extends MovableObject {
    // Image Hub
    BOTTLE_ON_GROUND = ImageHub.salsa_bottle.bottle_on_ground;
    BOTTEL_ROTATION = ImageHub.salsa_bottle.bottle_rotation;
    BOTTLE_SPLASH = ImageHub.salsa_bottle.bottle_splash;

    constructor(x, y){
        super();
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.BOTTLE_ON_GROUND);
        this.x = x;
        this.y = y;
        this.width = 80;
        this.height = 110;
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
        IntervallHub.startInterval(this.throwBottle, 1000 / 25);
    }

    throw(){
        this.speedY = 30;
        this.applyGravity();
    }
    throwBottle = () => {
        this.x += 10;
    }

    isAboveGround(){
        return true;
    }

}