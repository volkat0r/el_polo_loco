import {World} from "./scripts/models/world.class.js";
let canvas;
let world = new World();

console.log("should work");

function init(){
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");

    console.log("this should be printed:" + world);

}

