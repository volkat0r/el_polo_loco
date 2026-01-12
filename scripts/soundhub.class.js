export class SoundHub {
    static isMuted = false;

    static character = {
        walk: "./assets/sounds/character/characterRun.mp3",
        jump: "./assets/sounds/character/characterJump.wav",
        idle: "./assets/sounds/character/characterSnoring.mp3",
        hurt: "./assets/sounds/character/characterDamage.mp3",
        dead: "./assets/sounds/character/characterDead.wav"
    }
    static chicken = {
        dead: "./assets/sounds/chicken/chickenDead.mp3"
    }
    static endboss = {
        entry: "./assets/sounds/endboss/endbossApproach.wav"
    }
    static collect = {
        sound: "./assets/sounds/collectibles/bottleCollectSound.wav"
    }
    static gameStart = {
        sound: "./assets/sounds/game/gameStart.mp3"
    }
    static throwable = {
        sound: "./assets/sounds/throwable/bottleBreak.mp3"
    }

    static Sounds = [
        SoundHub.character.walk,
        SoundHub.character.jump,
        SoundHub.character.idle,
        SoundHub.character.hurt,
        SoundHub.character.dead,
        SoundHub.chicken.dead,
        SoundHub.endboss.entry,
        SoundHub.collect.sound,
        SoundHub.collect.gameStart,
        SoundHub.throwable.sound
    ];

    static playOne(sound) {
        if (!this.isMuted) {
            sound.volume = 0.2;
            sound.currentTime = 0;
            sound.play();
        }
    }

    static stopSingle(sound){
        sound.pause();
    }

    static muteAll() {
        SoundHub.isMuted = true;
        SoundHub.Sounds.forEach((sound) => {
            sound.volume = 0; 
        });
    }

    static unMuteAll() {
        SoundHub.isMuted = true;
        SoundHub.Sounds.forEach((sound) => {
            sound.volume = 0.2; 
        });
    }

    static stopAll() {
        SoundHub.Sounds.forEach((sound) => {
            sound.pause();
        });
    }
}