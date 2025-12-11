import {Character} from "./character.class.js";
import {Chicken} from "./chicken.class.js";

console.log("possible to import files?");

export class World{

    character = new Character();
    enemies = [
        new Chicken(),
        new Chicken(),
        new Chicken()
    ];

    constructor(){
    }

    draw(){

    }
}