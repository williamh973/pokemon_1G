export const resetFlyState = (pokemon) => {
  pokemon.volatils.fly = false;

  pokemon.chargedMove.move = null;
  pokemon.chargedMove.animationPhase = null;
};
