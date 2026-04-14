/**
 * Registers keyboard listeners for gameplay controls.
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @param {() => unknown} getWorld
 * @param {() => void} onEscapePressed
 * @returns {void}
 */
export function bindKeyboardControls(keyboard, getWorld, onEscapePressed) {
    window.addEventListener("keydown", (event) => handleKeyDown(event, keyboard, getWorld));
    window.addEventListener("keyup", (event) => handleKeyUp(event, keyboard, getWorld, onEscapePressed));
}

/**
 * Registers touch controls for mobile buttons.
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @returns {void}
 */
export function registerTouchControls(keyboard) {
    getTouchBindings().forEach(({ id, key }) => bindTouchControl(keyboard, id, key));
}

/**
 * Resets all keyboard flags to false.
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @returns {void}
 */
export function resetKeyboardState(keyboard) {
    keyboard.RIGHT = false;
    keyboard.LEFT = false;
    keyboard.UP = false;
    keyboard.THROW = false;
}

/**
 * Handles keyboard keydown events.
 * @param {KeyboardEvent} event
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @param {() => unknown} getWorld
 * @returns {void}
 */
function handleKeyDown(event, keyboard, getWorld) {
    if (!getWorld()) return;
    updateKeyboardState(keyboard, event.code, true);
}

/**
 * Handles keyboard keyup events.
 * @param {KeyboardEvent} event
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @param {() => unknown} getWorld
 * @param {() => void} onEscapePressed
 * @returns {void}
 */
function handleKeyUp(event, keyboard, getWorld, onEscapePressed) {
    if (event.code === "Escape") onEscapePressed();
    if (!getWorld()) return;
    updateKeyboardState(keyboard, event.code, false);
}

/**
 * Updates the matching keyboard flag for one physical key.
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @param {string} code
 * @param {boolean} pressed
 * @returns {void}
 */
function updateKeyboardState(keyboard, code, pressed) {
    if (code === "ArrowRight" || code === "KeyD") keyboard.RIGHT = pressed;
    if (code === "ArrowLeft" || code === "KeyA") keyboard.LEFT = pressed;
    if (code === "ArrowUp" || code === "KeyW" || code === "Space") keyboard.UP = pressed;
    if (code === "KeyE") keyboard.THROW = pressed;
}

/**
 * Returns touch button bindings for mobile gameplay controls.
 * @returns {{id: string, key: "LEFT"|"RIGHT"|"UP"|"THROW"}[]}
 */
function getTouchBindings() {
    return [
        { id: "touch-left", key: "LEFT" },
        { id: "touch-right", key: "RIGHT" },
        { id: "touch-jump", key: "UP" },
        { id: "touch-throw", key: "THROW" }
    ];
}

/**
 * Registers touch press and release events for one button.
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @param {string} id
 * @param {"LEFT"|"RIGHT"|"UP"|"THROW"} key
 * @returns {void}
 */
function bindTouchControl(keyboard, id, key) {
    const button = document.getElementById(id);
    if (!button) return;
    button.addEventListener("touchstart", (event) => onTouchPress(event, keyboard, key, button), { passive: false });
    const release = (event) => onTouchRelease(event, keyboard, key, button);
    button.addEventListener("touchend", release, { passive: false });
    button.addEventListener("touchcancel", release, { passive: false });
}

/**
 * Handles touch press on one control button.
 * @param {TouchEvent} event
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @param {"LEFT"|"RIGHT"|"UP"|"THROW"} key
 * @param {HTMLElement} button
 * @returns {void}
 */
function onTouchPress(event, keyboard, key, button) {
    preventCancelableDefault(event);
    keyboard[key] = true;
    button.classList.add("pressed");
}

/**
 * Handles touch release on one control button.
 * @param {TouchEvent} event
 * @param {import("../models/keyboard.class.js").Keyboard} keyboard
 * @param {"LEFT"|"RIGHT"|"UP"|"THROW"} key
 * @param {HTMLElement} button
 * @returns {void}
 */
function onTouchRelease(event, keyboard, key, button) {
    preventCancelableDefault(event);
    keyboard[key] = false;
    button.classList.remove("pressed");
}

/**
 * Prevents default behavior when an event is cancelable.
 * @param {Event} event
 * @returns {void}
 */
function preventCancelableDefault(event) {
    if (event.cancelable) event.preventDefault();
}
