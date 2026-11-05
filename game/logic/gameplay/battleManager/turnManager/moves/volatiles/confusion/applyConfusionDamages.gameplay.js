import { deductStatHP } from "../deductStatHP.gameplay.js";

export const applyConfusionDamages = (pokemon) => {
  const basicPower = 40;
  const levelFactor = (2 * pokemon.level) / 5 + 2;

  const damages = Math.floor(
    (levelFactor *
      basicPower *
      (pokemon.stats.attack / pokemon.stats.defense)) /
      30
  );

  deductStatHP(pokemon, damages);

  console.log(`${pokemon.name} perd `, damages, "PV à cause de la confusion");
};
