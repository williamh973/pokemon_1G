export const processMoveConsequence = (turnManager, action, sequence) => {
  if (!action.move.consequence) return false;

  switch (action.move.consequence.type) {
    case "RECHARGE":
      action.pokemon.volatils.recharge = true;
      break;

    default:
      break;
  }

  return false;
};
