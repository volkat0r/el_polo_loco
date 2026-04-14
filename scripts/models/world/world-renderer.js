/**
 * Prepares the canvas and camera for the next frame.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function prepareFrame(world) {
    world.cameraUpdate();
    world.ctx.clearRect(0, 0, world.canvas.width, world.canvas.height);
    world.ctx.translate(world.camera_x, 0);
}

/**
 * Draws all world objects in camera space.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function drawWorldObjects(world) {
    addObjectsToMap(world, world.level.backgroundObjects);
    addObjectsToMap(world, world.level.enemies);
    addObjectsToMap(world, world.level.clouds);
    addObjectsToMap(world, world.level.bottles);
    addObjectsToMap(world, world.level.coins);
    addObjectsToMap(world, world.throwableObjects);
    addToMap(world, world.character);
}

/**
 * Draws all world and HUD status bars.
 * @param {import("../world.class.js").World} world
 * @returns {void}
 */
export function drawStatusBars(world) {
    world.StatusBarEndboss.update();
    addToMap(world, world.StatusBarEndboss);
    world.ctx.translate(-world.camera_x, 0);
    addToMap(world, world.StatusBarHealth);
    addToMap(world, world.StatusBarBottles);
    addToMap(world, world.StatusBarCoins);
}

/**
 * Draws a list of drawable objects.
 * @param {import("../world.class.js").World} world
 * @param {Array<import("../drawable-object.class.js").DrawableObject>} objects
 * @returns {void}
 */
function addObjectsToMap(world, objects) {
    if (!objects) return;
    objects.forEach((object) => addToMap(world, object));
}

/**
 * Draws one object with optional sprite flip.
 * @param {import("../world.class.js").World} world
 * @param {import("../drawable-object.class.js").DrawableObject} movableObject
 * @returns {void}
 */
function addToMap(world, movableObject) {
    if (movableObject.otherDirection) flipImage(world, movableObject);
    movableObject.draw(world.ctx);
    movableObject.drawFrame(world.ctx);
    movableObject.drawOffsetFrame(world.ctx);
    if (movableObject.otherDirection) flipImageBack(world, movableObject);
}

/**
 * Flips the canvas for a mirrored sprite.
 * @param {import("../world.class.js").World} world
 * @param {import("../drawable-object.class.js").DrawableObject} movableObject
 * @returns {void}
 */
function flipImage(world, movableObject) {
    world.ctx.save();
    world.ctx.translate(movableObject.width, 0);
    world.ctx.scale(-1, 1);
    movableObject.x *= -1;
}

/**
 * Restores the canvas after drawing a mirrored sprite.
 * @param {import("../world.class.js").World} world
 * @param {import("../drawable-object.class.js").DrawableObject} movableObject
 * @returns {void}
 */
function flipImageBack(world, movableObject) {
    movableObject.x *= -1;
    world.ctx.restore();
}
