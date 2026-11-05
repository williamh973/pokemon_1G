export const checkStab = (move, pokemon) => {
  return pokemon.types.includes(move.type[0]) ? 1.5 : 1;
};
