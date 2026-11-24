export const resetChargedMoveState = (turnManager, pokemon) => {
  if (!pokemon) return;

  const initialPosition = pokemon.chargedMove.initialPosition;

  pokemon.chargedMove.move = null;
  pokemon.chargedMove.animationPhase = null;
  pokemon.chargedMove.turnAction = null;

  getSpriteViewer(turnManager, pokemon);

  resetSpriteInitialPositionIfNeeded(
    turnManager.pokemonViewer,
    initialPosition
  );
};

const getSpriteViewer = (turnManager, pokemon) => {
  if (turnManager.viewers.front.slot.content === pokemon)
    turnManager.pokemonViewer = turnManager.viewers.front;
  else turnManager.pokemonViewer = turnManager.viewers.back;
};

const resetSpriteInitialPositionIfNeeded = (pokemonViewer, initialPosition) => {
  if (!initialPosition || !pokemonViewer?.sprite) return;

  pokemonViewer.sprite.position = {
    x: initialPosition.x,
    y: initialPosition.y,
  };
};
