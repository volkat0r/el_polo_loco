import {MovableObject} from "./movable-object.class.js";
import {ImageHub} from "../imagehub.js";

export class Chicken extends MovableObject{
    x;
    y;

    imgWalk = ImageHub.chicken_normal.walk;
    imgDead = ImageHub.chicken_normal.dead;

    constructor(){
        super();
    }

    eat(){
        console.log("eat");
    }
}