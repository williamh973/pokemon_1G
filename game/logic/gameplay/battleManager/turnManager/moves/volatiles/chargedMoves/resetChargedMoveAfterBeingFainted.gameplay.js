export const resetChargedMoveAfterBeingFainted = (faintedPokemon) => {
  faintedPokemon.chargedMove = {
    move: null,
    animationPhase: null,
    initialPosition: null,
    turnAction: null,
  };
};
