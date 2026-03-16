import { World } from "./scripts/models/world.class.js";
import { Keyboard } from "./scripts/models/keyboard.class.js";
import { IntervalHub } from "./scripts/intervalhub.class.js";

let canvas;
let world;
let ctx;
let keyboard = new Keyboard();
let screenOverlay;
let screenTitle;
let screenText;
let screenBtn;

window.addEventListener("DOMContentLoaded", () => {
    init();
});

function init(){
    canvas = document.getElementById("canvas");
    screenOverlay = document.getElementById("screen-overlay");
    screenTitle = document.getElementById("screen-title");
    screenText = document.getElementById("screen-text");
    screenBtn = document.getElementById("screen-btn");
    ctx = canvas.getContext('2d');

    setScreen("start");

    screenBtn.addEventListener("click", () => {
        if (screenBtn.dataset.action === "start" || screenBtn.dataset.action === "restart") {
            startGame();
        }
    });
}

/* Game Status */

function startGame() {
    stopGame();
    resetKeyboard();
    hideOverlay();

    world = new World(canvas, keyboard);
    window.world = world;
}

function stopGame() {
    IntervalHub.clearAll();

    if (world) {
        world.stop();
        world = null;
    }
}

function endGame(status) {
    stopGame();
    setScreen(status);
}

/* Game Overlay */
function setScreen(status) {
    if (status === "start") {
        showOverlay("El Pollo Loco", "Bereit? Starte das Spiel.", "Start", "start");
    }

    if (status === "win") {
        showOverlay("Gewonnen!", "Der Endboss ist besiegt.", "Nochmal spielen", "restart");
    }

    if (status === "lose") {
        showOverlay("Verloren!", "Pepe ist k.o.", "Nochmal spielen", "restart");
    }

    if (status === "playing") {
        hideOverlay();
    }
}

function showOverlay(title, text, buttonLabel, action) {
    screenTitle.textContent = title;
    screenText.textContent = text;
    screenBtn.textContent = buttonLabel;
    screenBtn.dataset.action = action;
    screenOverlay.classList.remove("hidden");
}

function hideOverlay() {
    screenOverlay.classList.add("hidden");
}

function resetKeyboard() {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.THROW = false;
}


// Keyboard Event-Listener
window.addEventListener('keydown', (event) => {
    if (!world) return;
    if (event.code === "ArrowRight" || event.code === "KeyD") keyboard.RIGHT = true;
    if (event.code === "ArrowLeft" || event.code === "KeyA") keyboard.LEFT = true;
    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") keyboard.UP = true;
    if (event.code === "KeyE") keyboard.THROW = true;
})

window.addEventListener('keyup', (event) => {
    if (!world) return; 
    if (event.code === "ArrowRight" || event.code === "KeyD") keyboard.RIGHT = false;
    if (event.code === "ArrowLeft" || event.code === "KeyA") keyboard.LEFT = false;
    if (event.code === "ArrowUp" || event.code === "KeyW" || event.code === "Space") keyboard.UP = false;
    if (event.code === "KeyE") keyboard.THROW = false;
})

window.endGame = endGame;