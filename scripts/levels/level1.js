import { Cloud } from "../models/cloud.class.js";
import { Chicken } from "../models/chicken.class.js";
import { BackgroundObject } from "../models/background-object.class.js";
import { Level } from "../models/level.class.js";
import { Endboss } from "../models/endboss.class.js";
import { ChickenSmall } from "../models/chicken-small.class.js";

export let level1;

level1 = new Level(
    [
        new Endboss(),
        new ChickenSmall,
        new ChickenSmall,
        new ChickenSmall,
        new Chicken(),
        new Chicken(),
        new Chicken()
    ],
    [
        new Cloud()
    ],
    [
        new BackgroundObject('./assets/img/5_background/layers/air.png', -719),
        new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', -719),
        new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', -719),
        new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', -719),
        new BackgroundObject('./assets/img/5_background/layers/air.png', 0),
        new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 0),
        new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 0),
        new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 0),
        new BackgroundObject('./assets/img/5_background/layers/air.png', 719),
        new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 719),
        new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 719),
        new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 719),
        new BackgroundObject('./assets/img/5_background/layers/air.png', 719 * 2),
        new BackgroundObject('./assets/img/5_background/layers/3_third_layer/1.png', 719 * 2),
        new BackgroundObject('./assets/img/5_background/layers/2_second_layer/1.png', 719 * 2),
        new BackgroundObject('./assets/img/5_background/layers/1_first_layer/1.png', 719 * 2),
        new BackgroundObject('./assets/img/5_background/layers/air.png', 719 * 3),
        new BackgroundObject('./assets/img/5_background/layers/3_third_layer/2.png', 719 * 3),
        new BackgroundObject('./assets/img/5_background/layers/2_second_layer/2.png', 719 * 3),
        new BackgroundObject('./assets/img/5_background/layers/1_first_layer/2.png', 719 * 3)
    ]
);
