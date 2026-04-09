/**
 * Base drawable object with image cache and debug frames.
 */
export class DrawableObject{
    img;
    imageCache = {};
    currentImage = 0;
    lastRenderableImg = null;
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
        const img = new Image();
        img.onload = () => {
            this.lastRenderableImg = img;
        };
        img.src = path;
        this.img = img;
    }

    /**
     * Loads multiple images into cache.
     * @param {string[]} imageArray
     * @returns {void}
     */
    loadImages(imageArray) {
        imageArray.forEach((path) => {
            const img = new Image();
            img.onload = () => {
                if (!this.lastRenderableImg) {
                    this.lastRenderableImg = img;
                }
            };
            img.src = path;
            this.imageCache[path] = img;
        });
    }

    /**
     * Checks whether an image finished loading and can be drawn.
     * @param {HTMLImageElement | undefined} img
     * @returns {boolean}
     */
    isRenderableImage(img) {
        return !!img && img.complete && img.naturalWidth > 0;
    }

    /**
     * Draws object image on canvas.
     * @param {CanvasRenderingContext2D} ctx
     * @returns {void}
     */
    draw(ctx){
        const renderImg = this.isRenderableImage(this.img) ? this.img : this.lastRenderableImg;
        if (!this.isRenderableImage(renderImg)) return;

        this.lastRenderableImg = renderImg;
        ctx.drawImage(renderImg, this.x, this.y, this.width, this.height);
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