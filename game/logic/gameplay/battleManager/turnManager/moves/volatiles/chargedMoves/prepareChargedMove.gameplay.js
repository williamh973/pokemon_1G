export const prepareChargedMove = (pokemon, usingMove) => {
  if (pokemon.chargedMove?.animationPhase !== "SECOND") {
    pokemon.chargedMove.move = usingMove;
    pokemon.chargedMove.animationPhase = "FIRST";
  }
  return {
    isAffected: true,
    volatile: "CHARGED_MOVE",
    pokemon,
    canUseMove: true,
  };
};
