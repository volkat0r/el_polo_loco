import {MovableObject} from "./movable-object.class.js";

export class Cloud extends MovableObject{
    x = 50;
    y = 0;
    width = 600;
    height = 300;

    constructor(){
        super();
        this.loadImage('./assets/img/5_background/layers/4_clouds/2.png');
        this.x = Math.random() * 300;
        this.moveLeft();
    }
}