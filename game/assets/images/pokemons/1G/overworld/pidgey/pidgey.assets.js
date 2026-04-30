import { createImg } from "../../../../../../shareds/utils/assets/assets.utils.js";

const BASE_SRC = "game/assets/images/pokemons/1G/overworld";
const POKEMON = "pidgey";

export let idlePidgeyDown = createImg(`${BASE_SRC}/${POKEMON}/idleDown.png`);
export let idlePidgeyUp = createImg(`${BASE_SRC}/${POKEMON}/idleUp.png`);
export let idlePidgeyLeft = createImg(`${BASE_SRC}/${POKEMON}/idleLeft.png`);
export let idlePidgeyRight = createImg(`${BASE_SRC}/${POKEMON}/idleRight.png`);

export let walkPidgeyDown_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkDown_stepA.png`
);
export let walkPidgeyDown_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkDown_stepB.png`
);

export let walkPidgeyUp_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkUp_stepA.png`
);
export let walkPidgeyUp_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkUp_stepB.png`
);

export let walkPidgeyLeft_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkLeft_stepA.png`
);

export let walkPidgeyLeft_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkLeft_stepB.png`
);

export let walkPidgeyRight_stepA = createImg(
  `${BASE_SRC}/${POKEMON}/walkRight_stepA.png`
);

export let walkPidgeyRight_stepB = createImg(
  `${BASE_SRC}/${POKEMON}/walkRight_stepB.png`
);
