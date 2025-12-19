import {MovableObject} from "./movable-object.class.js";
import {IntervallHub} from "../intervalhub.class.js";
import {ImageHub} from "../imagehub.class.js";

export class Character extends MovableObject{
    x = 100;
    y = 0;
    width = 152;
    height = 300;
    speed = 4;
    world;

    // Image Hub
    IMAGES_IDLE = ImageHub.character.idle;
    IMAGES_IDLE_LONG = ImageHub.character.idle_long;
    IMAGES_WALK = ImageHub.character.walking;
    IMAGES_JUMP = ImageHub.character.jump;
    IMAGES_HURT = ImageHub.character.hurt;
    IMAGES_DEAD = ImageHub.character.dead;

    constructor(){
        super();
        this.showFrame = true;
        this.showOffsetFrame = true;
        this.loadImage(this.IMAGES_IDLE[0]);
        this.loadImages(this.IMAGES_IDLE);
        this.loadImages(this.IMAGES_WALK);
        this.loadImages(this.IMAGES_JUMP);
        this.loadImages(this.IMAGES_HURT);
        this.loadImages(this.IMAGES_DEAD);
        // this.playAnimation(this.IMAGES_WALK);
        this.animate();
        // IntervallHub.startInterval(this.applyGravity, 1000 / 25);
        this.applyGravity();

        this.offset = {
            left: 40,
            right: 40,
            top: 140,
            bottom: 15
        };

    }

    animate(){
        IntervallHub.startInterval(this.inputCheck, 1000 / 120);
        IntervallHub.startInterval(this.selectAnimation, 1000 / 20);
    }

    selectAnimation = () => {
        if(this.isAboveGround()) {
            // JUMP Animation
            this.playAnimation(this.IMAGES_JUMP);
        } else if (this.world.keyboard.RIGHT || this.world.keyboard.LEFT) {
            this.x += this.speed;
            // Walk Animation
            this.playAnimation(this.IMAGES_WALK);
        }
    }

    inputCheck = () => {
        if(this.world.keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.moveRight();
        }
        if(this.world.keyboard.LEFT && this.x > 0) {
            this.otherDirection = true;
            this.moveLeft();
        }
        if (this.world.keyboard.UP && !this.isAboveGround()){
            this.jump();
        }
        this.world.camera_x = -this.x +75;
    }

    hit(enemy) {
        if (this.energy <= 0) return;

        this.energy -= 10;
        console.log('Character hit, energy:', this.energy);
    }
}