export const replacePokemonMove = (pokemon, oldMove, newMove) => {
  const moveIndex = pokemon.moves.findIndex((move) => move.id === oldMove.id);

  if (moveIndex === -1) {
    return {
      success: false,
      reason: "MOVE_NOT_FOUND",
    };
  }

  pokemon.moves[moveIndex] = {
    ...newMove,
  };

  return {
    success: true,
  };
};
