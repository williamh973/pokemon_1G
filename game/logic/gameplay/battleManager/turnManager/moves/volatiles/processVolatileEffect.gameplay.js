import { processConfusionTurn } from "./confusion/processConfusionTurn.gameplay.js";
import { processFlyTurn } from "./fly/processFlyTurn.gameplay.js";

export const processVolatileEffect = (action) => {
  const { pokemon, move } = action;
  let canUseMove = true;

  if (pokemon.volatils.confusionTurns > 0)
    return processConfusionTurn(pokemon, canUseMove);

  if (pokemon.volatils.fly || move?.id === "fly")
    return processFlyTurn(pokemon, move);

  return {
    isAffected: false,
    pokemon,
    canUseMove: true,
  };
};
