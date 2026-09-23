export const processMoveConsequence = (action) => {
  if (!action.move.consequence) return false;

  switch (action.move.consequence.type) {
    case "RECHARGE":
      action.pokemon.volatils.recharge = true;
      break;

    default:
      break;
  }
};
