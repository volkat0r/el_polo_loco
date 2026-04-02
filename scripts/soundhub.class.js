/**
 * Handles all game sounds and mute state.
 */
export class SoundHub {
    static MUTE_STORAGE_KEY = "epl-muted";
    static isMuted = false;
    static defaultVolume = 0.2;

    static character = {
        walk: new Audio("./assets/sounds/character/characterRun.mp3"),
        jump: new Audio("./assets/sounds/character/characterJump.wav"),
        idle: new Audio("./assets/sounds/character/characterSnoring.mp3"),
        hurt: new Audio("./assets/sounds/character/characterDamage.mp3"),
        dead: new Audio("./assets/sounds/character/characterDead.wav")
    };
    static chicken = {
        dead: new Audio("./assets/sounds/chicken/chickenDead.mp3"),
        dead_small: new Audio("./assets/sounds/chicken/chickenDead2.mp3")
    };
    static endboss = {
        entry: new Audio("./assets/sounds/endboss/endbossApproach.wav")
    };
    static collect = {
        sound: new Audio("./assets/sounds/collectibles/bottleCollectSound.wav")
    };
    static gameStart = {
        sound: new Audio("./assets/sounds/game/gameStart.mp3")
    };
    static throwable = {
        sound: new Audio("./assets/sounds/throwable/bottleBreak.mp3")
    };
    static bg = {
        music: new Audio("./assets/sounds/bgmusic/Guitar Cartwheel - Loop - Medium.mp3")
    };

    static sounds = [
        SoundHub.character.walk,
        SoundHub.character.jump,
        SoundHub.character.idle,
        SoundHub.character.hurt,
        SoundHub.character.dead,
        SoundHub.chicken.dead,
        SoundHub.chicken.dead_small,
        SoundHub.endboss.entry,
        SoundHub.collect.sound,
        SoundHub.gameStart.sound,
        SoundHub.throwable.sound,
        SoundHub.bg.music
    ];

    static Sounds = SoundHub.sounds;

    /**
     * Initializes audio settings for all sounds.
     * @returns {void}
     */
    static init() {
        SoundHub.isMuted = SoundHub.loadMutedState();

        SoundHub.sounds.forEach((sound) => {
            sound.preload = "auto";
            sound.loop = false;
            sound.volume = SoundHub.isMuted ? 0 : SoundHub.defaultVolume;
        });
    }

    /**
     * Plays one sound from the start.
     * @param {HTMLAudioElement} sound
     * @param {number} [volume=SoundHub.defaultVolume]
     * @returns {void}
     */
    static playOne(sound, volume = SoundHub.defaultVolume) {
        if (!sound || SoundHub.isMuted) return;

        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    /**
     * Alias for playOne.
     * @param {HTMLAudioElement} sound
     * @param {number} [volume=SoundHub.defaultVolume]
     * @returns {void}
     */
    static play(sound, volume = SoundHub.defaultVolume) {
        SoundHub.playOne(sound, volume);
    }

    /**
     * Plays a sound in loop mode.
     * @param {HTMLAudioElement} sound
     * @param {number} [volume=SoundHub.defaultVolume]
     * @returns {void}
     */
    static playLoop(sound, volume = SoundHub.defaultVolume) {
        if (!sound || SoundHub.isMuted) return;

        sound.loop = true;
        sound.volume = volume;

        if (sound.paused) {
            sound.play().catch(() => {});
        }
    }

    /**
     * Stops one sound.
     * @param {HTMLAudioElement} sound
     * @param {boolean} [reset=false]
     * @returns {void}
     */
    static stopSingle(sound, reset = false) {
        if (!sound) return;

        sound.pause();
        if (reset) {
            sound.currentTime = 0;
        }
    }

    /**
     * Mutes all sounds.
     * @returns {void}
     */
    static muteAll() {
        SoundHub.isMuted = true;
        SoundHub.sounds.forEach((sound) => {
            sound.volume = 0;
        });
        SoundHub.saveMutedState();
    }

    /**
     * Unmutes all sounds.
     * @returns {void}
     */
    static unMuteAll() {
        SoundHub.isMuted = false;
        SoundHub.sounds.forEach((sound) => {
            sound.volume = SoundHub.defaultVolume;
        });
        SoundHub.saveMutedState();
    }

    /**
     * Toggles between muted and unmuted.
     * @returns {void}
     */
    static toggleMute() {
        if (SoundHub.isMuted) {
            SoundHub.unMuteAll();
            return;
        }

        SoundHub.muteAll();
    }

    /**
     * Stops and resets all sounds.
     * @returns {void}
     */
    static stopAll() {
        SoundHub.sounds.forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
            sound.loop = false;
        });
    }

    /**
     * Loads mute state from local storage.
     * @returns {boolean}
     */
    static loadMutedState() {
        try {
            return window.localStorage.getItem(SoundHub.MUTE_STORAGE_KEY) === "true";
        } catch {
            return false;
        }
    }

    /**
     * Saves mute state to local storage.
     * @returns {void}
     */
    static saveMutedState() {
        try {
            window.localStorage.setItem(SoundHub.MUTE_STORAGE_KEY, String(SoundHub.isMuted));
        } catch {
            // Ignore storage errors (e.g. private mode restrictions).
        }
    }
}