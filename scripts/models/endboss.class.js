export class Endboss extends MovableObject{
    x;
    y;

    // Img Src
    imgWalk = ImageHub.end_boss.walk;
    imgAlert = ImageHub.end_boss.alert;
    imgAttack = ImageHub.end_boss.attack;
    imgHurt = ImageHub.end_boss.hurt;
    imgDead = ImageHub.end_boss.dead;

    constructor(){
        super();
    }


}