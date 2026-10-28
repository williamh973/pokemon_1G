export const resetFlyState = (turnManager, pokemon) => {
  if (!pokemon) return;

  pokemon.volatils.fly = false;

  const initialPosition = pokemon.chargedMove.initialPosition;

  pokemon.chargedMove.move = null;
  pokemon.chargedMove.animationPhase = null;
  pokemon.chargedMove.turnAction = null;

  turnManager.getSpriteViewer(pokemon);

  resetSpriteInitialPositionIfNeeded(
    turnManager.pokemonViewer,
    initialPosition
  );
};

const resetSpriteInitialPositionIfNeeded = (pokemonViewer, initialPosition) => {
  if (!initialPosition || !pokemonViewer?.sprite) return;

  pokemonViewer.sprite.position = {
    x: initialPosition.x,
    y: initialPosition.y,
  };
};
