import { createImg } from "../../../../../../shareds/utils/assets/assets.utils.js";

const BASE_SRC = "game/assets/images/pokemons/1G/overworld";
const POKEMON = "onix";

export let idleOnixDown = createImg(`${BASE_SRC}/${POKEMON}/idleDown.png`);
export let idleOnixUp = createImg(`${BASE_SRC}/${POKEMON}/idleUp.png`);
export let idleOnixLeft = createImg(`${BASE_SRC}/${POKEMON}/idleLeft.png`);
export let idleOnixRight = createImg(`${BASE_SRC}/${POKEMON}/idleRight.png`);

export let walkOnixDown_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkDown_stepA.png`
);
export let walkOnixDown_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkDown_stepB.png`
);

export let walkOnixUp_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkUp_stepA.png`
);

export let walkOnixUp_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkUp_stepB.png`
);

export let walkOnixLeft_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkLeft_stepA.png`
);

export let walkOnixLeft_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkLeft_stepB.png`
);

export let walkOnixRight_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkRight_stepA.png`
);

export let walkOnixRight_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkRight_stepB.png`
);
