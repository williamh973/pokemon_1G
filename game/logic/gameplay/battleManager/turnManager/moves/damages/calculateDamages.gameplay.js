import { randomBetween } from "../../../../../../shareds/utils/math/math.utils.js";
import { getStatStageMultiplier } from "../../statStages/getStatStageMultiplier.gameplay.js";
import { calculateMod1 } from "./formulas/calculateMod1.gameplay.js";
import { calculateMod3 } from "./formulas/calculateMod3.gameplay.js";
import { calculateType } from "./formulas/calculateType.gameplay.js";

const checkStab = (move, pokemon) => {
  return pokemon.types.includes(move.type[0]) ? 1.5 : 1;
};

export const calculateMoveDamages = (action, CC, weather) => {
  const pokemon = action.pokemon;
  const pokemonLevel = action.pokemon.level;

  const move = action.move;
  const movePower = move.power;

  const target = action.target;

  const MOD1 = calculateMod1(action, weather);
  const MOD2 = 1;
  const MOD3 = calculateMod3(action);
  const STAB = checkStab(move, pokemon);
  const RAND = randomBetween(217, 255);
  const TYPE1 = calculateType(action, target.types[0]);
  const TYPE2 = calculateType(action, target.types[1]);

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

  console.log({
    level: pokemonLevel,
    power: movePower,
    attack,
    defense,
    MOD1,
    CC,
    MOD2,
    RAND,
    STAB,
    TYPE1,
    TYPE2,
    MOD3,
  });

  return Math.floor(
    (((((((pokemonLevel * 2) / 5 + 2) * movePower * attack) / 50 / defense) *
      MOD1 +
      2) *
      CC *
      MOD2 *
      RAND) /
      100) *
      STAB *
      TYPE1 *
      TYPE2 *
      MOD3
  );
};
