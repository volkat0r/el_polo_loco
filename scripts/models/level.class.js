/**
 * Stores all objects used in one level.
 */
export class Level {
    enemies;
    clouds;
    coins;
    bottles;
    backgroundObjects;
    level_end_x;

    /**
     * Creates a new level setup.
     * @param {Array} enemies
     * @param {Array} clouds
     * @param {Array} coins
     * @param {Array} bottles
     * @param {Array} backgroundObjects
     */
    constructor(enemies, clouds, coins, bottles, backgroundObjects){
        this.enemies = enemies;
        this.clouds = clouds;
        this.coins = coins;
        this.bottles = bottles;
        this.backgroundObjects = backgroundObjects;
        this.level_end_x = 719 * 3;
    }
}