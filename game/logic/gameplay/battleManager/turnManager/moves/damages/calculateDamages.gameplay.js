import { getStatStageMultiplier } from "../../statStages/getStatStageMultiplier.gameplay.js";

export const calculateMoveDamages = (action) => {
  const pokemon = action.pokemon;
  const pokemonLevel = action.pokemon.level;
  const levelFactor = (2 * pokemonLevel) / 5 + 2;
  const move = action.move;
  const movePower = move.power;
  const target = action.target;

  const isPhysical = move.class.includes("PHYSICAL");

  const attackStage =
    pokemon.statStages[isPhysical ? "attack" : "specialAtt"] ?? 0;
  const defenseStage =
    target.statStages[isPhysical ? "defense" : "specialDef"] ?? 0;

  const attack =
    pokemon.stats[isPhysical ? "attack" : "specialAtt"] *
    getStatStageMultiplier(attackStage);

  const defense =
    target.stats[isPhysical ? "defense" : "specialDef"] *
    getStatStageMultiplier(defenseStage);
  return Math.floor((levelFactor * movePower * (attack / defense)) / 30);
};
