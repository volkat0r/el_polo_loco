import { SoundHub } from "../soundhub.class.js";

const SCREEN_BUTTON_IMAGES = {
    start: "./assets/img/play-key.webp",
    restart: "./assets/img/play-again-button.webp"
};

const SCREEN_RESULT_IMAGES = {
    win: "./assets/img/You%20won,%20you%20lost/You%20won%20A.png",
    lose: "./assets/img/You%20won,%20you%20lost/You%20lost.png"
};

/**
* Creates a UI controller for overlay, sound buttons, modal, and fullscreen.
* @param {{onStartRequested: () => void, onHomeRequested: () => void}} handlers
* @returns {{canvas: HTMLCanvasElement, closeInstructionsModal: () => void, hideOverlay: () => void, requestFullscreenOnMobile: () => void, setScreen: (status: "win"|"lose"|"start"|"playing") => void, updateSoundButtonsState: () => void}}
*/
export function createGameUi(handlers) {
    const refs = cacheDomElements();
    bindUiEvents(refs, handlers);
    return {
        canvas: refs.canvas,
        closeInstructionsModal: () => closeInstructionsModal(refs),
        hideOverlay: () => hideOverlay(refs),
        requestFullscreenOnMobile,
        setScreen: (status) => setScreen(refs, status),
        updateSoundButtonsState: () => updateSoundButtonsState(refs)
    };
}

/**
* Caches all DOM elements used by the game UI.
* @returns {{canvas: HTMLCanvasElement, fullscreenButton: HTMLElement | null, instructionsCloseButton: HTMLElement | null, instructionsModal: HTMLElement | null, instructionsOpenButton: HTMLElement | null, muteButton: HTMLElement | null, screenBtn: HTMLButtonElement, screenHomeBtn: HTMLButtonElement | null, screenOverlay: HTMLElement, screenResultImage: HTMLImageElement | null, screenText: HTMLElement, screenTitle: HTMLElement, unmuteButton: HTMLElement | null}}
*/
function cacheDomElements() {
    return {
        canvas: document.getElementById("canvas"),
        fullscreenButton: document.getElementById("fullscreen-btn"),
        instructionsCloseButton: document.getElementById("instructions-close-btn"),
        instructionsModal: document.getElementById("instructions-modal"),
        instructionsOpenButton: document.getElementById("instructions-open-btn"),
        muteButton: document.querySelector(".overlay-symbols .mute"),
        screenBtn: document.getElementById("screen-btn"),
        screenHomeBtn: document.getElementById("screen-home-btn"),
        screenOverlay: document.getElementById("screen-overlay"),
        screenResultImage: document.getElementById("screen-result-image"),
        screenText: document.getElementById("screen-text"),
        screenTitle: document.getElementById("screen-title"),
        unmuteButton: document.querySelector(".overlay-symbols .unmute")
    };
}

/**
* Registers all UI event listeners.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {{onStartRequested: () => void, onHomeRequested: () => void}} handlers
* @returns {void}
*/
function bindUiEvents(refs, handlers) {
    refs.screenBtn.addEventListener("click", () => handleScreenButtonClick(refs, handlers.onStartRequested));
    refs.screenHomeBtn?.addEventListener("click", handlers.onHomeRequested);
    refs.muteButton?.addEventListener("click", () => handleMuteClick(refs));
    refs.unmuteButton?.addEventListener("click", () => handleUnmuteClick(refs));
    refs.fullscreenButton?.addEventListener("click", toggleFullscreen);
    refs.instructionsOpenButton?.addEventListener("click", () => openInstructionsModal(refs));
    refs.instructionsCloseButton?.addEventListener("click", () => closeInstructionsModal(refs));
    refs.instructionsModal?.addEventListener("click", (event) => handleInstructionsBackdropClick(refs, event));
}

/**
* Starts the game when the overlay action button is pressed.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {() => void} onStartRequested
* @returns {void}
*/
function handleScreenButtonClick(refs, onStartRequested) {
    const action = refs.screenBtn.dataset.action;
    if (action === "start" || action === "restart") onStartRequested();
}

/**
* Handles mute button click.
* @param {ReturnType<typeof cacheDomElements>} refs
* @returns {void}
*/
function handleMuteClick(refs) {
    SoundHub.muteAll();
    updateSoundButtonsState(refs);
}

/**
* Handles unmute button click.
* @param {ReturnType<typeof cacheDomElements>} refs
* @returns {void}
*/
function handleUnmuteClick(refs) {
    SoundHub.unMuteAll();
    updateSoundButtonsState(refs);
}

/**
* Closes instructions when the backdrop is clicked.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {MouseEvent} event
* @returns {void}
*/
function handleInstructionsBackdropClick(refs, event) {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.dataset.closeInstructions === "true") closeInstructionsModal(refs);
}

/**
* Toggles browser fullscreen mode.
* @returns {void}
*/
function toggleFullscreen() {
    if (!document.fullscreenElement) {
        requestFullscreen(document.documentElement);
        return;
    }

    exitFullscreen();
}

/**
* Requests fullscreen automatically on touch devices.
* @returns {void}
*/
function requestFullscreenOnMobile() {
    if (!isTouchDevice()) return;
    if (document.fullscreenElement) return;
    requestFullscreen(document.documentElement);
}

/**
* Requests fullscreen for a given element.
* @param {HTMLElement} target
* @returns {void}
*/
function requestFullscreen(target) {
    const request =
        target.requestFullscreen ||
        target.webkitRequestFullscreen ||
        target.msRequestFullscreen;
    request?.call(target)?.catch?.(() => {});
}

/**
* Exits fullscreen mode.
* @returns {void}
*/
function exitFullscreen() {
    const exit =
        document.exitFullscreen ||
        document.webkitExitFullscreen ||
        document.msExitFullscreen;
    exit?.call(document)?.catch?.(() => {});
}

/**
* Returns whether the current device uses touch input.
* @returns {boolean}
*/
function isTouchDevice() {
    return window.matchMedia("(hover: none) and (pointer: coarse)").matches;
}

/**
* Updates mute and unmute button visibility.
* @param {ReturnType<typeof cacheDomElements>} refs
* @returns {void}
*/
function updateSoundButtonsState(refs) {
    const muted = SoundHub.isMuted;
    refs.muteButton?.classList.toggle("is-hidden", muted);
    refs.unmuteButton?.classList.toggle("is-hidden", !muted);
}

/**
* Sets the current overlay screen.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {"win"|"lose"|"start"|"playing"} status
* @returns {void}
*/
function setScreen(refs, status) {
    if (status === "playing") {
        setHomeButtonVisible(refs, false);
        hideOverlay(refs);
        return;
    }

    const config = getScreenConfig(status);
    if (!config) return;
    setHomeButtonVisible(refs, config.showHomeButton);
    showOverlay(refs, config.title, config.text, config.buttonLabel, config.action);
}

/**
* Returns overlay content for a given status.
* @param {"win"|"lose"|"start"|"playing"} status
* @returns {{action: string, buttonLabel: string, showHomeButton: boolean, text: string, title: string}|null}
*/
function getScreenConfig(status) {
    if (status === "start") {
        return makeScreenConfig(false, "El Pollo Loco", "Ready? Start the game!", "Start", "start");
    }

    if (status === "win") {
        return makeScreenConfig(true, "You won!", "The endboss is dead!", "Play again", "restart");
    }

    if (status === "lose") {
        return makeScreenConfig(true, "You lost!", "Pepe has died!", "Play again", "restart");
    }

    return null;
}

/**
* Creates one overlay config object.
* @param {boolean} showHomeButton
* @param {string} title
* @param {string} text
* @param {string} buttonLabel
* @param {string} action
* @returns {{action: string, buttonLabel: string, showHomeButton: boolean, text: string, title: string}}
*/
function makeScreenConfig(showHomeButton, title, text, buttonLabel, action) {
    return { action, buttonLabel, showHomeButton, text, title };
}

/**
* Shows or hides the home button.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {boolean} visible
* @returns {void}
*/
function setHomeButtonVisible(refs, visible) {
    refs.screenHomeBtn?.classList.toggle("hidden", !visible);
}

/**
* Renders overlay title, text, and action button.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {string} title
* @param {string} text
* @param {string} buttonLabel
* @param {string} action
* @returns {void}
*/
function showOverlay(refs, title, text, buttonLabel, action) {
    setOverlayResultImage(refs, action);
    refs.screenTitle.textContent = title;
    refs.screenText.textContent = text;
    setOverlayButtonImage(refs, action, buttonLabel);
    refs.screenBtn.dataset.action = action;
    refs.screenOverlay.classList.remove("hidden");
}

/**
* Updates the result image for the current overlay state.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {string} status
* @returns {void}
*/
function setOverlayResultImage(refs, status) {
    if (!refs.screenResultImage) return;
    const imageSrc = SCREEN_RESULT_IMAGES[status];

    if (!imageSrc) {
        refs.screenResultImage.classList.add("hidden");
        refs.screenResultImage.removeAttribute("src");
        refs.screenResultImage.setAttribute("alt", "");
        return;
    }

    const altText = status === "win" ? "You won" : "You lost";
    refs.screenResultImage.src = imageSrc;
    refs.screenResultImage.alt = altText;
    refs.screenResultImage.classList.remove("hidden");
}

/**
* Updates the overlay action button image.
* @param {ReturnType<typeof cacheDomElements>} refs
* @param {string} action
* @param {string} fallbackAlt
* @returns {void}
*/
function setOverlayButtonImage(refs, action, fallbackAlt) {
    const imageSrc = SCREEN_BUTTON_IMAGES[action] || SCREEN_BUTTON_IMAGES.start;
    const altText = fallbackAlt || "Start";
    refs.screenBtn.innerHTML = `<img src="${imageSrc}" alt="${altText}">`;
    refs.screenBtn.setAttribute("aria-label", altText);
}

/**
* Hides the overlay.
* @param {ReturnType<typeof cacheDomElements>} refs
* @returns {void}
*/
function hideOverlay(refs) {
    refs.screenOverlay.classList.add("hidden");
}

/**
* Opens the instructions modal.
* @param {ReturnType<typeof cacheDomElements>} refs
* @returns {void}
*/
function openInstructionsModal(refs) {
    refs.instructionsModal?.classList.remove("hidden");
}

/**
* Closes the instructions modal.
* @param {ReturnType<typeof cacheDomElements>} refs
* @returns {void}
*/
function closeInstructionsModal(refs) {
    refs.instructionsModal?.classList.add("hidden");
}
