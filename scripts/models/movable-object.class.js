import { IntervalHub } from "../intervalhub.class.js";
import { DrawableObject } from "./drawable-object.class.js";

export class MovableObject extends DrawableObject{
    currentImage = 0;
    speed = 0.15;
    otherDirection = false;
    speedY = 0;
    acceleration = 2.5;
    energy = 100;

    offset = {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    };

    /**
     * Starts gravity updates for this object.
     * @returns {void}
     */
    applyGravity(){
        IntervalHub.startInterval(this.gravityInterval, 1000 / 25);
    }

    /**
     * Updates vertical speed and position.
     * @returns {void}
     */
    gravityInterval = () => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    /**
     * Checks if object is above ground level.
     * @returns {boolean}
     */
    isAboveGround(){
        return this.y < 120;
    }

    /**
     * Loads one image file.
     * @param {string} path
     * @returns {void}
     */
    loadImage(path){
        super.loadImage(path);
    }

    /**
     * Draws object image on canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    draw(ctx){
        super.draw(ctx);
    }

    /**
     * Plays sprite animation frame by frame.
     * @param {string[]} images
     * @returns {void}
     */
    playAnimation(images){
        if (!images?.length) return;

        const index = this.currentImage % images.length;
        const path = images[index];
        const nextImg = this.imageCache[path];

        if (this.isRenderableImage(nextImg)) {
            this.img = nextImg;
            this.lastRenderableImg = nextImg;
        }

        this.currentImage++;
    }

    /**
     * Moves object to the right.
     * @returns {void}
     */
    moveRight = () => {
        this.otherDirection = false;
        this.x += this.speed;
    };

    /**
     * Moves object to the left.
     * @returns {void}
     */
    moveLeft = () => {
        this.x -= this.speed;
    }
    
    /**
     * Starts upward jump movement.
     * @returns {void}
     */
    jump = () =>{
        this.speedY = 25;
    }

    /**
     * Base flag for jump support.
     * @returns {boolean}
     */
    isJumpable() {
        return false;
    }

    /* Collision checks */
    /**
     * Checks basic rectangle collision.
     * @param {MovableObject} mo
     * @returns {boolean}
     */
    isColliding(mo){
        return  this.x + this.width > mo.x && // R > L
                this.y + this.height > mo.y && // T > B
                this.x < mo.x + mo.width && // L > R
                this.y < mo.y + mo.height // B > T
    };

    // Checks collision using hitbox offsets.
    /**
     * Checks collision using object offsets.
     * @param {MovableObject} mo
     * @returns {boolean}
     */
    isCollidingOffset(mo){
        return  this.x + this.width - this.offset.right > mo.x + mo.offset.left && // R > L
                this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // T > B
                this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // L > R
                this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom // B > T
    };

}
