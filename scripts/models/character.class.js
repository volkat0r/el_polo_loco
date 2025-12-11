import {MovableObject} from "./movable-object.class.js";
import {ImageHub} from "../imagehub.js";

export class Character extends MovableObject{
    x;
    y;

    // Image Src
    imgIdle = ImageHub.character.idle;
    imgIdleLong = ImageHub.character.idle_long;
    imgWalk = ImageHub.character.walking;
    imgJump = ImageHub.character.jump;
    imgHurt = ImageHub.character.hurt;
    imgDead = ImageHub.character.dead;

    constructor(){

    }

    moveRight(){

    }

    jump(){

    }
}