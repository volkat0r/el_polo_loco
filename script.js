import { World } from "./scripts/models/world.class.js";
import { Keyboard } from "./scripts/models/keyboard.class.js";
import { IntervalHub } from "./scripts/intervalhub.class.js";
import { SoundHub } from "./scripts/soundhub.class.js";

let canvas;
let world;
let ctx;
let keyboard = new Keyboard();
let screenOverlay;
let screenTitle;
let screenText;
let screenBtn;
let muteButton;
let unmuteButton;

const SCREEN_BUTTON_IMAGES = {
    start: "./assets/img/play-key.webp",
    restart: "./assets/img/play-again-button.webp"
};

window.addEventListener("DOMContentLoaded", () => {
    init();
});

function init(){
    canvas = document.getElementById("canvas");
    screenOverlay = document.getElementById("screen-overlay");
    screenTitle = document.getElementById("screen-title");
    screenText = document.getElementById("screen-text");
    screenBtn = document.getElementById("screen-btn");
    muteButton = document.querySelector(".overlay-symbols .mute");
    unmuteButton = document.querySelector(".overlay-symbols .unmute");
    ctx = canvas.getContext('2d');

    SoundHub.init();
    setScreen("start");
    updateSoundButtonsState();

    screenBtn.addEventListener("click", () => {
        if (screenBtn.dataset.action === "start" || screenBtn.dataset.action === "restart") {
            startGame();
        }
    });

    muteButton?.addEventListener("click", () => {
        SoundHub.muteAll();
        updateSoundButtonsState();
    });

    unmuteButton?.addEventListener("click", () => {
        SoundHub.unMuteAll();
        updateSoundButtonsState();
    });
}

function updateSoundButtonsState() {
    const muted = SoundHub.isMuted;
    muteButton?.classList.toggle("is-hidden", muted);
    unmuteButton?.classList.toggle("is-hidden", !muted);
}

/* Game Status */

function startGame() {
    stopGame();
    resetKeyboard();
    hideOverlay();

    world = new World(canvas, keyboard);
    window.world = world;
    SoundHub.playOne(SoundHub.gameStart.sound);
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
        showOverlay("El Pollo Loco", "Ready? Start the game!", "Start", "start");
    }

    if (status === "win") {
        showOverlay("Gewonnen!", "The endboss is dead!", "Play again", "restart");
    }

    if (status === "lose") {
        showOverlay("Verloren!", "Pepe has died!", "Play again", "restart");
    }

    if (status === "playing") {
        hideOverlay();
    }
}

function showOverlay(title, text, buttonLabel, action) {
    screenTitle.textContent = title;
    screenText.textContent = text;
    setOverlayButtonImage(action, buttonLabel);
    screenBtn.dataset.action = action;
    screenOverlay.classList.remove("hidden");
}

function setOverlayButtonImage(action, fallbackAlt) {
    const imageSrc = SCREEN_BUTTON_IMAGES[action] || SCREEN_BUTTON_IMAGES.start;
    const altText = fallbackAlt || "Start";

    screenBtn.innerHTML = `<img src="${imageSrc}" alt="${altText}">`;
    screenBtn.setAttribute("aria-label", altText);
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