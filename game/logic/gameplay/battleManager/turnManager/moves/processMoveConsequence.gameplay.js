import { DIALOGS_DATABASE } from "../../../../../shareds/dialogs/dialogs.database.js";
import { processMovesEffect } from "./processMovesEffect.gameplay.js";
import { deductStatHP } from "./volatiles/deductStatHP.gameplay.js";

export const processMoveConsequence = (
  turnManager,
  action,
  sequence,
  moveDamagesResult
) => {
  if (!action.move.consequence) return false;

  const pokemon = action.pokemon;
  const move = action.move;

  switch (action.move.consequence.type) {
    case "RECHARGE":
      pokemon.volatils.recharge = true;
      break;

    case "BACKWARD":
      const damages = moveDamagesResult.damages;
      const backwardRate = move.consequence?.rate;
      const backwardDamages = Math.floor((damages * backwardRate) / 100);

      deductStatHP(pokemon, backwardDamages);

      pokemon.volatils.backward = true;
      break;

    default:
      return false;
  }
};
