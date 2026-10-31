export const getPendingChargedMoveAction = (
  turnManager,
  excludedPokemon = null
) => {
  return [turnManager.firstAction, turnManager.secondAction].find((action) => {
    const pokemon = action?.pokemon;
    const chargedMove = pokemon?.chargedMove;

    return (
      pokemon &&
      pokemon !== excludedPokemon &&
      chargedMove?.move &&
      chargedMove.animationPhase === "FIRST"
    );
  });
};
