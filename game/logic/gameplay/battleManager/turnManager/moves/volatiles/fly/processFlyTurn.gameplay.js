export const processFlyTurn = (pokemon, usingMove) => {
  if (!pokemon.volatils.fly) {
    pokemon.volatils.fly = true;
    pokemon.chargedMove.move = usingMove;
    pokemon.chargedMove.animationPhase = "FIRST";
  }

  return {
    isAffected: true,
    volatile: "FLY",
    pokemon,
    canUseMove: true,
  };
};
