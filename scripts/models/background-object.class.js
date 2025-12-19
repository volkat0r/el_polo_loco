import {MovableObject} from "./movable-object.class.js";
import {ImageHub} from "../imagehub.class.js";

export class BackgroundObject extends MovableObject{
    width = 720;
    height = 480;

    // BACKGROUND_FIRST = ImageHub.background.first;
    // BACKGROUND_SECOND = ImageHub.background.second;

    constructor(imagePath, x){
        super();
        this.loadImage(imagePath);

        this.x = x;
        this.y = 480 - this.height;
    }
}