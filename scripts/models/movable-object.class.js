import {IntervallHub} from "../intervalhub.class.js";

export class MovableObject {
    x = 120;
    y = 280;
    width = 100;
    height = 150;
    img;
    imageCache = {};
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

    applyGravity(){
        IntervallHub.startInterval(this.gravityInterval, 1000 / 25);
    }

    gravityInterval = () => {
        if (this.isAboveGround() || this.speedY > 0) {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;
        }
    }

    isAboveGround(){
        return this.y < 120;
    }

    loadImage(path){
        this.img = new Image(); // Image is an object which is already existing & creates a img-tag just in js
        this.img.src = path;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    drawFrame(ctx) {
        if (!this.showFrame) return;

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    drawOffsetFrame(ctx) {
        if (!this.showOffsetFrame) return;

        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
        ctx.stroke();
    }

    loadImages(imageArray) {
        imageArray.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    playAnimation(images){
        const index = this.currentImage % images.length;
        const path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    moveRight = () => {
        this.otherDirection = false;
        this.x += this.speed;
    };

    moveLeft = () => {
        this.x -= this.speed;
    }
    
    jump = () =>{
        this.speedY = 25;
    }

    /* MovableObject - Collition Calculation */
    isColliding(mo){
        return  this.x + this.width > mo.x && // R > L
                this.y + this.height > mo.y && // T > B
                this.x < mo.x + mo.width && // L > R
                this.y < mo.y + mo.height // B > T
    };

    // Offset Collision
    isCollidingOffset(mo){
        return  this.x + this.width - this.offset.right > mo.x + mo.offset.left && // R > L
                this.y + this.height - this.offset.bottom > mo.y + mo.offset.top && // T > B
                this.x + this.offset.left < mo.x + mo.width - mo.offset.right && // L > R
                this.y + this.offset.top < mo.y + mo.height - mo.offset.bottom // B > T
    };

    /* Try to add intervalHub here RETRY!
        moveLeft(){
            IntervallHub.startInterval(this.selectAnimation, 1000 / 20);
        }
        selectAnimation = () => {
            this.x -= this.speed;
        }
        
        _____________________


        applyGravity(){
            setInterval(() => {
                if (this.y < 180) {
                    this.y -= this.speedY;
                    this.speedY -= this.acceleration;
                }
            }, 1000 / 60);
        }
        
        =

        applyGravity(){
            IntervallHub.startInterval(this.gravityInterval, 1000 / 60);
        }
        gravityInterval(){
            if (this.y < 180) {
                this.y -= this.speedY;
                this.speedY -= this.acceleration;
            }
        }


    */

}
