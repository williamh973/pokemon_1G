export const isPendingMultiHitTurn = (currentAction) => {
  const { pokemon, move, isMultiHitInitialized } = currentAction;

  const isPending =
    move.effect?.type === "MULTI_HIT" &&
    pokemon.volatils.multiHitTurns > 0 &&
    isMultiHitInitialized;

  if (isPending) {
    console.log(
      `${pokemon.name} doit continuer d'attaquer encore ${pokemon.volatils.multiHitTurns} fois.`
    );
  }

  return isPending;
};
