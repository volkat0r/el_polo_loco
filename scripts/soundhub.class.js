export class SoundHub {
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
        dead: new Audio("./assets/sounds/chicken/chickenDead.mp3")
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

    static sounds = [
        SoundHub.character.walk,
        SoundHub.character.jump,
        SoundHub.character.idle,
        SoundHub.character.hurt,
        SoundHub.character.dead,
        SoundHub.chicken.dead,
        SoundHub.endboss.entry,
        SoundHub.collect.sound,
        SoundHub.gameStart.sound,
        SoundHub.throwable.sound
    ];

    static Sounds = SoundHub.sounds;

    static init() {
        SoundHub.sounds.forEach((sound) => {
            sound.preload = "auto";
            sound.loop = false;
            sound.volume = SoundHub.isMuted ? 0 : SoundHub.defaultVolume;
        });
    }

    static playOne(sound, volume = SoundHub.defaultVolume) {
        if (!sound || SoundHub.isMuted) return;

        sound.volume = volume;
        sound.currentTime = 0;
        sound.play().catch(() => {});
    }

    static play(sound, volume = SoundHub.defaultVolume) {
        SoundHub.playOne(sound, volume);
    }

    static playLoop(sound, volume = SoundHub.defaultVolume) {
        if (!sound || SoundHub.isMuted) return;

        sound.loop = true;
        sound.volume = volume;

        if (sound.paused) {
            sound.play().catch(() => {});
        }
    }

    static stopSingle(sound, reset = false) {
        if (!sound) return;

        sound.pause();
        if (reset) {
            sound.currentTime = 0;
        }
    }

    static muteAll() {
        SoundHub.isMuted = true;
        SoundHub.sounds.forEach((sound) => {
            sound.volume = 0;
        });
    }

    static unMuteAll() {
        SoundHub.isMuted = false;
        SoundHub.sounds.forEach((sound) => {
            sound.volume = SoundHub.defaultVolume;
        });
    }

    static toggleMute() {
        if (SoundHub.isMuted) {
            SoundHub.unMuteAll();
            return;
        }

        SoundHub.muteAll();
    }

    static stopAll() {
        SoundHub.sounds.forEach((sound) => {
            sound.pause();
            sound.currentTime = 0;
            sound.loop = false;
        });
    }
}