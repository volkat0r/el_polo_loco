import { Chicken } from "../models/chicken.class.js";
import { ChickenSmall } from "../models/chicken-small.class.js";
import { Coins } from "../models/coin.class.js";
import { Bottles } from "../models/bottle.class.js";
import { Level } from "../models/level.class.js";
import { Cloud } from "../models/cloud.class.js";
import { BackgroundObject } from "../models/background-object.class.js";

export let level1;

const AIR_PATH = "./assets/img/5_background/layers/air.png";
const BACKGROUND_SEGMENTS = [-719, 0, 719, 719 * 2, 719 * 3];

/**
 * Creates and returns level 1 setup.
 * @returns {Level}
 */
export function createLevel1() {
    return new Level(
        createEnemies(),
        createClouds(),
        createCoins(),
        createBottles(),
        createBackgroundObjects()
    );
}

/**
 * Creates all enemies for level 1.
 * @returns {(Chicken|ChickenSmall)[]}
 */
function createEnemies() {
    return [
        ...createRepeated(() => new ChickenSmall(), 3),
        ...createRepeated(() => new Chicken(), 3)
    ];
}

/**
 * Creates all cloud objects for level 1.
 * @returns {Cloud[]}
 */
function createClouds() {
    return createRepeated(() => new Cloud(), 6);
}

/**
 * Creates all coin objects for level 1.
 * @returns {Coins[]}
 */
function createCoins() {
    return createRepeated(() => new Coins(), 10);
}

/**
 * Creates all bottle objects for level 1.
 * @returns {Bottles[]}
 */
function createBottles() {
    return createRepeated(() => new Bottles(), 10);
}

/**
 * Creates all background objects for level 1.
 * @returns {BackgroundObject[]}
 */
function createBackgroundObjects() {
    const backgrounds = [];
    BACKGROUND_SEGMENTS.forEach((x, index) => {
        addBackgroundSegment(backgrounds, x, index % 2 === 0);
    });
    return backgrounds;
}

/**
 * Adds one full parallax segment at a given x-position.
 * @param {BackgroundObject[]} backgrounds
 * @param {number} x
 * @param {boolean} useSecondVariant
 * @returns {void}
 */
function addBackgroundSegment(backgrounds, x, useSecondVariant) {
    const variant = useSecondVariant ? "2" : "1";
    backgrounds.push(new BackgroundObject(AIR_PATH, x));
    backgrounds.push(new BackgroundObject(`./assets/img/5_background/layers/3_third_layer/${variant}.png`, x));
    backgrounds.push(new BackgroundObject(`./assets/img/5_background/layers/2_second_layer/${variant}.png`, x));
    backgrounds.push(new BackgroundObject(`./assets/img/5_background/layers/1_first_layer/${variant}.png`, x));
}

/**
 * Creates an array by repeatedly calling a factory function.
 * @template T
 * @param {() => T} factory
 * @param {number} count
 * @returns {T[]}
 */
function createRepeated(factory, count) {
    return Array.from({ length: count }, () => factory());
}

level1 = createLevel1();
