import { World } from "./scripts/models/world.class.js";
import { Keyboard } from "./scripts/models/keyboard.class.js";
import { IntervalHub } from "./scripts/intervalhub.class.js";
import { SoundHub } from "./scripts/soundhub.class.js";

let canvas;
let world;
let ctx;
let keyboard = new Keyboard();
let screenOverlay;
let screenResultImage;
let screenTitle;
let screenText;
let screenBtn;
let muteButton;
let unmuteButton;
let fullscreenButton;

const SCREEN_BUTTON_IMAGES = {
    start: "./assets/img/play-key.webp",
    restart: "./assets/img/play-again-button.webp"
};

const SCREEN_RESULT_IMAGES = {
    win: "./assets/img/You%20won,%20you%20lost/You%20won%20A.png",
    lose: "./assets/img/You%20won,%20you%20lost/You%20lost.png"
};

window.addEventListener("DOMContentLoaded", () => {
    init();
});

function init(){
    canvas = document.getElementById("canvas");
    screenOverlay = document.getElementById("screen-overlay");
    screenResultImage = document.getElementById("screen-result-image");
    screenTitle = document.getElementById("screen-title");
    screenText = document.getElementById("screen-text");
    screenBtn = document.getElementById("screen-btn");
    muteButton = document.querySelector(".overlay-symbols .mute");
    unmuteButton = document.querySelector(".overlay-symbols .unmute");
    fullscreenButton = document.getElementById("fullscreen-btn");
    ctx = canvas.getContext('2d');

    SoundHub.init();
    setScreen("start");
    updateSoundButtonsState();
    registerTouchControls();

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

    fullscreenButton?.addEventListener("click", () => {
        toggleFullscreen();
    });
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        const target = document.documentElement;
        const request =
            target.requestFullscreen ||
            target.webkitRequestFullscreen ||
            target.msRequestFullscreen;
        request?.call(target)?.catch?.(() => {});
    } else {
        const exit =
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.msExitFullscreen;
        exit?.call(document)?.catch?.(() => {});
    }
}

function updateSoundButtonsState() {
    const muted = SoundHub.isMuted;
    muteButton?.classList.toggle("is-hidden", muted);
    unmuteButton?.classList.toggle("is-hidden", !muted);
}

/* Game Status */
function startGame() {
    requestFullscreenOnMobile();
    stopGame();
    resetKeyboard();
    hideOverlay();

    world = new World(canvas, keyboard);
    window.world = world;
    SoundHub.playOne(SoundHub.gameStart.sound);
}

function requestFullscreenOnMobile() {
    const isTouchDevice = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
    if (!isTouchDevice) return;
    if (document.fullscreenElement) return;

    const fullscreenTarget = document.documentElement;
    const requestFullscreen =
        fullscreenTarget.requestFullscreen ||
        fullscreenTarget.webkitRequestFullscreen ||
        fullscreenTarget.msRequestFullscreen;

    if (typeof requestFullscreen !== "function") return;

    const requestResult = requestFullscreen.call(fullscreenTarget);
    requestResult?.catch?.(() => {});
}

function stopGame() {
    IntervalHub.clearAll();
    SoundHub.stopAll();

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
        showOverlay("You won!", "The endboss is dead!", "Play again", "restart");
    }

    if (status === "lose") {
        showOverlay("You lost!", "Pepe has died!", "Play again", "restart");
    }

    if (status === "playing") {
        hideOverlay();
    }
}

function showOverlay(title, text, buttonLabel, action) {
    setOverlayResultImage(action);
    screenTitle.textContent = title;
    screenText.textContent = text;
    setOverlayButtonImage(action, buttonLabel);
    screenBtn.dataset.action = action;
    screenOverlay.classList.remove("hidden");
}

function setOverlayResultImage(status) {
    if (!screenResultImage) return;

    const imageSrc = SCREEN_RESULT_IMAGES[status];

    if (!imageSrc) {
        screenResultImage.classList.add("hidden");
        screenResultImage.removeAttribute("src");
        screenResultImage.setAttribute("alt", "");
        return;
    }

    const altText = status === "win" ? "You won" : "You lost";
    screenResultImage.src = imageSrc;
    screenResultImage.alt = altText;
    screenResultImage.classList.remove("hidden");
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

function registerTouchControls() {
    const bindings = [
        { id: 'touch-left',  key: 'LEFT' },
        { id: 'touch-right', key: 'RIGHT' },
        { id: 'touch-jump',  key: 'UP' },
        { id: 'touch-throw', key: 'THROW' },
    ];

    bindings.forEach(({ id, key }) => {
        const btn = document.getElementById(id);
        if (!btn) return;

        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            keyboard[key] = true;
            btn.classList.add('pressed');
        }, { passive: false });

        const release = (e) => {
            e.preventDefault();
            keyboard[key] = false;
            btn.classList.remove('pressed');
        };

        btn.addEventListener('touchend',    release, { passive: false });
        btn.addEventListener('touchcancel', release, { passive: false });
    });
}