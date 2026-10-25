export const resetFlyState = (turnManager) => {
  turnManager.firstAction.pokemon.volatils.fly = false;

  turnManager.firstAction.pokemon.chargedMove.move = null;
  turnManager.firstAction.pokemon.chargedMove.animationPhase = null;

  turnManager.getSpriteViewer(turnManager.firstAction.pokemon);

  resetSpriteInitialPositionIfNeeded(turnManager.pokemonViewer);
};

const resetSpriteInitialPositionIfNeeded = (pokemonViewer) => {
  const sprite = pokemonViewer.sprite;
  const pokemon = pokemonViewer.slot.content;

  sprite.position = {
    x: pokemon.chargedMove.initialPosition.x,
    y: pokemon.chargedMove.initialPosition.y,
  };
};
