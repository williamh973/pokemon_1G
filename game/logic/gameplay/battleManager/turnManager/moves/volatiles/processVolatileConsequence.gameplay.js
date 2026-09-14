import { deductStatHP } from "./deductStatHP.gameplay.js";

export const processVolatileConsequence = (pokemon) => {
  let canUseMove = true;

  if (pokemon.volatils.confusionTurns < 1) {
    return {
      isAffected: false,
      pokemon,
      canUseMove,
    };
  }

  pokemon.volatils.confusionTurns -= 1;

  if (pokemon.volatils.confusionTurns === 0) {
    console.log("CA PASSE");
    return {
      isAffected: true,
      hasConfusedNoMore: true,
      pokemon,
      canUseMove,
    };
  }

  const random100 = Math.floor(Math.random() * 100) + 1;

  if (random100 <= 50)
    return {
      isAffected: true,
      resist: true,
      pokemon,
      canUseMove,
    };

  deductStatHP(pokemon);

  return {
    isAffected: true,
    resist: false,
    pokemon,
    canUseMove: false,
  };
};
