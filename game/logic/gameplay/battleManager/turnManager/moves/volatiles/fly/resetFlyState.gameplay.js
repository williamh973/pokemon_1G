export const resetFlyState = (turnManager) => {
  const findedActionContainsChargedMove =
    turnManager.getActionContainsChargedMove();

  findedActionContainsChargedMove.pokemon.volatils.fly = false;

  findedActionContainsChargedMove.pokemon.chargedMove.move = null;
  findedActionContainsChargedMove.pokemon.chargedMove.animationPhase = null;
  findedActionContainsChargedMove.pokemon.chargedMove.turnAction = null;

  turnManager.getSpriteViewer(findedActionContainsChargedMove.pokemon);

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
