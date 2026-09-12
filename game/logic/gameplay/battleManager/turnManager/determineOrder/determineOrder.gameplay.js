export const determineOrder = (turnManager) => {
  turnManager.playerMove = turnManager.battleManager.selectedMove;
  turnManager.wildMove = turnManager.battleManager.wildPokemonSelectedMove;

  const player = {
    pokemon: turnManager.battleManager.currentPlayerPokemon,
    move: turnManager.playerMove,
  };

  const wild = {
    pokemon: turnManager.battleManager.wildPokemon,
    move: turnManager.wildMove,
  };

  const order = [player, wild].sort((a, b) => {
    const priorityDifference = (b.move.priority ?? 0) - (a.move.priority ?? 0);
    console.log(b.move, a.move);
    if (priorityDifference !== 0) return priorityDifference;

    return b.pokemon.stats.speed - a.pokemon.stats.speed;
  });

  if (
    order[0].pokemon.stats.speed === order[1].pokemon.stats.speed &&
    (order[0].move.priority ?? 0) === (order[1].move.priority ?? 0)
  ) {
    if (Math.random() < 0.5) order.reverse();
  }

  turnManager.firstAction = {
    pokemon: order[0].pokemon,
    move: order[0].move,
    target: order[1].pokemon,
    trainerId: order[0].pokemon.trainerId,
  };

  turnManager.secondAction = {
    pokemon: order[1].pokemon,
    move: order[1].move,
    target: order[0].pokemon,
    trainerId: order[1].pokemon.trainerId,
  };
};
