import { processConfusionTurn } from "./confusion/processConfusionTurn.gameplay.js";
import { prepareChargedMove } from "./chargedMoves/prepareChargedMove.gameplay.js";

export const processVolatileEffect = (action) => {
  const { pokemon, move } = action;
  let canUseMove = true;

  if (pokemon.volatils.confusionTurns > 0)
    return processConfusionTurn(pokemon, canUseMove);

  if (
    pokemon.chargedMove?.move?.effect?.volatile === "CHARGED_MOVE" ||
    move.effect?.volatile === "CHARGED_MOVE"
  )
    return prepareChargedMove(pokemon, move);

  if (pokemon.volatils.isFrighten)
    return {
      isAffected: true,
      volatile: "FRIGHTEN",
      pokemon,
      canUseMove: false,
    };

  return {
    isAffected: false,
    pokemon,
    canUseMove: true,
  };
};
