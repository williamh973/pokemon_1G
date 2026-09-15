import { deductStatHP } from "./deductStatHP.gameplay.js";

export const processVolatileEffect = (pokemon) => {
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
    return {
      isAffected: true,
      volatile: "CONFUSION",
      hasConfusedNoMore: true,
      pokemon,
      canUseMove,
    };
  }

  const random100 = Math.floor(Math.random() * 100) + 1;

  if (random100 <= 50)
    return {
      isAffected: true,
      volatile: "CONFUSION",
      resist: true,
      pokemon,
      canUseMove,
    };

  deductStatHP(pokemon);

  return {
    isAffected: true,
    volatile: "CONFUSION",
    resist: false,
    pokemon,
    canUseMove: false,
  };
};
