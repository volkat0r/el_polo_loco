export class DrawableObject{
    img;
    imageCache = {};
    currentImage = 0;
    x = 120;
    y = 280;
    width = 100;
    height = 150;

    loadImage(path){
        this.img = new Image(); // Image is an object which is already existing & creates a img-tag just in js
        this.img.src = path;
    }

    loadImages(imageArray) {
        imageArray.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
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

}