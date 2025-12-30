import { World } from "./scripts/models/world.class.js";
import { Keyboard } from "./scripts/models/keyboard.class.js";

let canvas;
let world;
let ctx;
let keyboard = new Keyboard();

window.addEventListener("DOMContentLoaded", () => {
    init();
});

function init(){
    canvas = document.getElementById("canvas");
    world = new World(canvas, keyboard);
    ctx = canvas.getContext('2d');

    window.world = world;
    window.keyboard = keyboard;
}


// Keyboard Event-Listener
window.addEventListener('keydown', (event) => {
    if (event.code === "ArrowRight" || event.code === "KeyD") keyboard.RIGHT = true;
    if (event.code === "ArrowLeft" || event.code === "KeyA") keyboard.LEFT = true;
    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") keyboard.UP = true;
    if (event.code === "KeyE") keyboard.THROW = true;
})

window.addEventListener('keyup', (event) => {
    if (event.code === "ArrowRight" || event.code === "KeyD") keyboard.RIGHT = false;
    if (event.code === "ArrowLeft" || event.code === "KeyA") keyboard.LEFT = false;
    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") keyboard.UP = false;
    if (event.code === "KeyE") keyboard.THROW = false;
})