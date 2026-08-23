export const calculateMoveDamages = (action) => {
  const pokemon = action.pokemon;
  const pokemonLevel = action.pokemon.level;
  const levelFactor = (2 * pokemonLevel) / 5 + 2;
  const move = action.move;
  const movePower = move.power;
  const target = action.target;

  const isPhysical = move.class.includes("PHYSICAL");

  const attack = isPhysical ? pokemon.stats.attack : pokemon.stats.specialAtt;
  const defense = isPhysical ? target.stats.defense : target.stats.specialDef;

  return Math.floor((levelFactor * movePower * (attack / defense)) / 30);
};
