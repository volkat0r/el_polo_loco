/**
 * Base drawable object with image cache and debug frames.
 */
export class DrawableObject{
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    width = 100;
    height = 150;

    /**
     * Loads a single image into img.
     * @param {string} path
     * @returns {void}
     */
    loadImage(path){
        this.img = new Image(); // Image is an object which is already existing & creates a img-tag just in js
        this.img.src = path;
    }

    /**
     * Loads multiple images into cache.
     * @param {string[]} imageArray
     * @returns {void}
     */
    loadImages(imageArray) {
        imageArray.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Draws object image on canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Draws blue debug frame.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    drawFrame(ctx) {
        if (!this.showFrame) return;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'blue';
        ctx.rect(this.x, this.y, this.width, this.height);
        ctx.stroke();
    }

    /**
     * Draws red offset debug frame.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    drawOffsetFrame(ctx) {
        if (!this.showOffsetFrame) return;
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'red';
        ctx.rect(this.x + this.offset.left, this.y + this.offset.top, this.width - this.offset.left - this.offset.right, this.height - this.offset.top - this.offset.bottom);
        ctx.stroke();
    }
}