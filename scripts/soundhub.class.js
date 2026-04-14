/**
* Handles all game sounds and mute state.
*/
export class SoundHub {
    static MUTE_STORAGE_KEY = "epl-muted";
    static isMuted = false;
    static defaultVolume = 0.2;

    /**
    * Stores the desired audible volume per sound.
    * @type {WeakMap<HTMLAudioElement, number>}
    */
    static soundVolumes = new WeakMap();

    /**
    * Tracks whether a sound should keep looping when audio is audible.
    * @type {WeakMap<HTMLAudioElement, boolean>}
    */
    static loopingSounds = new WeakMap();

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
    static gameResult = {
        win: new Audio("./assets/sounds/game/win-sound.mp3"),
        lose: new Audio("./assets/sounds/game/loose-sound.mp3")
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
        SoundHub.gameResult.win,
        SoundHub.gameResult.lose,
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
        SoundHub.sounds.forEach((sound) => SoundHub.configureSound(sound));
    }

    /**
    * Applies initial settings to one sound.
    * @param {HTMLAudioElement} sound
    * @returns {void}
    */
    static configureSound(sound) {
        sound.preload = "auto";
        sound.loop = false;
        SoundHub.soundVolumes.set(sound, SoundHub.defaultVolume);
        SoundHub.loopingSounds.set(sound, false);
        sound.volume = SoundHub.isMuted ? 0 : SoundHub.defaultVolume;
    }

    /**
    * Plays one sound from the start.
    * @param {HTMLAudioElement} sound
    * @param {number} [volume=SoundHub.defaultVolume]
    * @returns {void}
    */
    static playOne(sound, volume = SoundHub.defaultVolume) {
        if (!sound) return;
        SoundHub.soundVolumes.set(sound, volume);
        SoundHub.loopingSounds.set(sound, false);
        sound.loop = false;
        if (SoundHub.isMuted) return;
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
        if (!sound) return;
        SoundHub.prepareLoopSound(sound, volume);
        if (SoundHub.isMuted) return SoundHub.setMutedVolume(sound);
        SoundHub.resumeLoopSound(sound, volume);
    }

    /**
    * Marks a sound as looped and attaches loop handler.
    * @param {HTMLAudioElement} sound
    * @param {number} volume
    * @returns {void}
    */
    static prepareLoopSound(sound, volume) {
        SoundHub.soundVolumes.set(sound, volume);
        SoundHub.loopingSounds.set(sound, true);
        sound.loop = true;
        sound.removeEventListener("ended", SoundHub.handleSoundEnded);
        sound.addEventListener("ended", SoundHub.handleSoundEnded);
    }

    /**
    * Sets sound volume to muted level.
    * @param {HTMLAudioElement} sound
    * @returns {void}
    */
    static setMutedVolume(sound) {
        sound.volume = 0;
    }

    /**
    * Resumes loop playback with target volume.
    * @param {HTMLAudioElement} sound
    * @param {number} volume
    * @returns {void}
    */
    static resumeLoopSound(sound, volume) {
        sound.volume = volume;
        if (!sound.paused) return;
        sound.play().catch(() => {});
    }

    /**
    * Handles ended event for looping sounds.
    * @param {Event} e
    * @returns {void}
    */
    static handleSoundEnded(e) {
        const sound = e.target;
        if (SoundHub.loopingSounds.get(sound)) {
            sound.currentTime = 0;
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
        SoundHub.loopingSounds.set(sound, false);
        sound.loop = false;
        sound.removeEventListener('ended', SoundHub.handleSoundEnded);
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
        SoundHub.sounds.forEach((sound) => SoundHub.restoreAudibleSound(sound));
        SoundHub.saveMutedState();
    }

    /**
    * Restores one sound volume and restarts loop if needed.
    * @param {HTMLAudioElement} sound
    * @returns {void}
    */
    static restoreAudibleSound(sound) {
        const volume = SoundHub.soundVolumes.get(sound) ?? SoundHub.defaultVolume;
        sound.volume = volume;
        if (!SoundHub.loopingSounds.get(sound) || !sound.paused) return;
        sound.play().catch(() => {});
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
            SoundHub.loopingSounds.set(sound, false);
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
