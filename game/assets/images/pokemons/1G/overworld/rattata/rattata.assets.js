import { createImg } from "../../../../../../shareds/utils/assets/assets.utils.js";

const BASE_SRC = "game/assets/images/pokemons/1G/overworld";
const POKEMON = "rattata";

export let idleRattataDown = createImg(`${BASE_SRC}/${POKEMON}/idleDown.png`);
export let idleRattataUp = createImg(`${BASE_SRC}/${POKEMON}/idleUp.png`);
export let idleRattataLeft = createImg(`${BASE_SRC}/${POKEMON}/idleLeft.png`);
export let idleRattataRight = createImg(`${BASE_SRC}/${POKEMON}/idleRight.png`);

export let walkRattataDown_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkDown_stepA.png`
);
export let walkRattataDown_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkDown_stepB.png`
);

export let walkRattataUp_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkUp_stepA.png`
);
export let walkRattataUp_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkUp_stepB.png`
);

export let walkRattataLeft_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkLeft_stepA.png`
);

export let walkRattataLeft_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkLeft_stepB.png`
);

export let walkRattataRight_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkRight_stepA.png`
);

export let walkRattataRight_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkRight_stepB.png`
);
