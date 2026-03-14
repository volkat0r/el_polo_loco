import { ImageHub } from "../imagehub.class.js";
import { MovableObject } from "./movable-object.class.js";

export class Bottles extends MovableObject {
    width = 80;
    height = 110;

    // Image Hub
    BOTTLE_ON_GROUND = ImageHub.salsa_bottle.bottle_on_ground;
    BOTTEL_ROTATION = ImageHub.salsa_bottle.bottle_rotation;
    BOTTLE_SPLASH = ImageHub.salsa_bottle.bottle_splash;

    constructor(){
        super();

        this.showFrame = false;
        this.showOffsetFrame = false;
        this.loadImage(this.BOTTLE_ON_GROUND[0]);
        this.x = Math.random() * 1500;
        this.y = 330;
        this.collected = false;

        this.offset = {
            left: 30,
            right: 15,
            top: 15,
            bottom: 10
        };
    }
}