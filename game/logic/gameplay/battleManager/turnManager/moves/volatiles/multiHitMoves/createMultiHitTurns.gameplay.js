import { randomBetween } from "../../../../../../../shareds/utils/math/math.utils.js";

export const createMultiHitTurns = (pokemon, action) => {
  const minCount = action.move.effect?.minCount;
  const maxCount = action.move.effect?.maxCount;
  const currentTurn = 1;

  pokemon.volatils.multiHitTurns = randomBetween(minCount, maxCount);

  const deductedMultiHitTurn = pokemon.volatils.multiHitTurns - currentTurn;

  pokemon.volatils.multiHitTurns = deductedMultiHitTurn;

  console.log(
    "Définition du nombre de Multi Hits : ",
    pokemon.volatils.multiHitTurns
  );
};
