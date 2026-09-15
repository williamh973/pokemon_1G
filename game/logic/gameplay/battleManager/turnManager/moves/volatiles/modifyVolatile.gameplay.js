import { randomBetween } from "../../../../../../shareds/utils/math/math.utils.js";

export const modifyVolatile = (action, volatile) => {
  const pokemon = action.pokemon;
  const target = action.target;

  switch (volatile) {
    case "CONFUSION":
      if (target.volatils.confusionTurns >= 1)
        return {
          alreadyConfusing: true,
          target,
          volatile,
        };

      target.volatils.confusionTurns = randomBetween(1, 4);
      break;

    case "SCARED":
      pokemon.volatils.isScared = true;
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
