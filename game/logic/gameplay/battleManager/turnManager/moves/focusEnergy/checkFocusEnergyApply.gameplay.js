export const checkFocusEnergyApply = (action) => {
  const pokemon = action.pokemon;

  if (!pokemon.volatils.hasBoostedByFocusEnergy) {
    pokemon.volatils.hasBoostedByFocusEnergy = true;

    return {
      hasBoostedByFocusEnergy: true,
      pokemon: pokemon,
    };
  } else
    return {
      hasBoostedByFocusEnergy: false,
    };
};
