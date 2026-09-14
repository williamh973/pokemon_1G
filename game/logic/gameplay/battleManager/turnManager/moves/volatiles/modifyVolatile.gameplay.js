import { randomBetween } from "../../../../../../shareds/utils/math/math.utils.js";

export const modifyVolatile = (target, volatile) => {
  switch (volatile) {
    case "CONFUSION":
      target.volatils.confusionTurns = randomBetween(1, 4);
      break;

    case "SCARED":
      target.volatils.isScared = true;
      break;

    default:
      break;
  }

  return {
    target,
    volatile,
  };
};
