import {
  random,
  randomBetween,
} from "../../../../../../shareds/utils/math/math.utils.js";

export const modifyVolatile = (action, volatile) => {
  const pokemon = action.pokemon;
  const target = action.target;

  switch (volatile) {
    case "PREVENTS_LAST_MOVE":
      if (!target.lastMove || !target.lastMove.enabled)
        return {
          isAffected: false,
          target,
          volatile,
        };

      target.volatils.disabledMove = target.lastMove;
      target.volatils.disabledMove.enabled = false;
      target.volatils.disabledTurns = 2;

      return {
        isAffected: true,
        target,
        volatile,
      };

    case "CONFUSION":
      if (target.volatils.confusionTurns >= 1)
        return {
          alreadyConfusing: true,
          target,
          volatile,
        };

      target.volatils.confusionTurns = randomBetween(1, 4);
      break;

    case "FRIGHTEN":
      if (random(action.move.effect?.percentage))
        action.target.volatils.isFrighten = true;
      break;

    case "FOCUS_ENERGY":
      if (pokemon.volatils.hasBoostedByFocusEnergy)
        return {
          alreadyBoostedByFocusEnergy: true,
          pokemon,
          volatile,
        };

      pokemon.volatils.hasBoostedByFocusEnergy = true;
      break;
    default:
      break;
  }

  return {
    pokemon,
    target,
    volatile,
  };
};
