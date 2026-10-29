import { processConfusionTurn } from "./confusion/processConfusionTurn.gameplay.js";
import { prepareChargedMove } from "./chargedMoves/prepareChargedMove .gameplay.js";

export const processVolatileEffect = (action) => {
  const { pokemon, move } = action;
  let canUseMove = true;

  if (pokemon.volatils.confusionTurns > 0)
    return processConfusionTurn(pokemon, canUseMove);

  if (!pokemon.chargedMove?.move?.id === "fly" || move?.id === "fly")
    return prepareChargedMove(pokemon, move);

  return {
    isAffected: false,
    pokemon,
    canUseMove: true,
  };
};
