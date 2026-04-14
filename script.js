import { World } from "./scripts/models/world.class.js";
import { Keyboard } from "./scripts/models/keyboard.class.js";
import { IntervalHub } from "./scripts/intervalhub.class.js";
import { SoundHub } from "./scripts/soundhub.class.js";
import { createGameUi } from "./scripts/ui/game-ui.js";
import { bindKeyboardControls, registerTouchControls, resetKeyboardState } from "./scripts/ui/input-controls.js";

let world;
let gameUi;
const keyboard = new Keyboard();

window.addEventListener("DOMContentLoaded", init);
window.endGame = endGame;

/**
 * Initializes the game UI, audio, and input handling.
 * @returns {void}
 */
function init() {
    gameUi = createGameUi({ onHomeRequested: returnToStart, onStartRequested: startGame });
    SoundHub.init();
    gameUi.setScreen("start");
    gameUi.updateSoundButtonsState();
    registerTouchControls(keyboard);
    bindKeyboardControls(keyboard, () => world, () => gameUi.closeInstructionsModal());
}

/**
 * Starts a new game session.
 * @returns {void}
 */
function startGame() {
    gameUi.requestFullscreenOnMobile();
    stopGame();
    resetKeyboardState(keyboard);
    gameUi.hideOverlay();
    world = new World(gameUi.canvas, keyboard);
    window.world = world;
    SoundHub.playOne(SoundHub.gameStart.sound);
    SoundHub.playLoop(SoundHub.bg.music, 0.15);
}

/**
 * Stops the current game and clears running loops.
 * @returns {void}
 */
function stopGame() {
    IntervalHub.clearAll();
    SoundHub.stopAll();
    if (!world) return;
    world.stop();
    world = null;
}

/**
 * Ends the game and shows the requested result screen.
 * @param {"win"|"lose"|"start"|"playing"} status
 * @returns {void}
 */
function endGame(status) {
    stopGame();
    playResultSound(status);
    gameUi.setScreen(status);
}

/**
 * Returns from a result screen to the start screen.
 * @returns {void}
 */
function returnToStart() {
    stopGame();
    resetKeyboardState(keyboard);
    gameUi.setScreen("start");
}

/**
 * Plays audio feedback for a win or lose result.
 * @param {"win"|"lose"|"start"|"playing"} status
 * @returns {void}
 */
function playResultSound(status) {
    if (status === "win") SoundHub.playOne(SoundHub.gameResult.win, 0.2);
    if (status === "lose") SoundHub.playOne(SoundHub.gameResult.lose, 0.2);
}
