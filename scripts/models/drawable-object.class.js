export class DrawableObject{
    img;
    imageCache = {};
    currentImage = 0;
    x = 0;
    y;

    loadImage(path){
        this.img = new Image(); // Image is an object which is already existing & creates a img-tag just in js
        this.img.src = path;
    }

    draw(ctx){
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

}