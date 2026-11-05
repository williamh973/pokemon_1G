export const calculateVariableDamage = (action) => {
  const pokemonLevel = action.pokemon.level;
  const moveEffect = action.move?.effect;

  switch (moveEffect?.type) {
    case "VARIABLE_DAMAGE":
      return Math.floor(
        Math.max(
          1,
          Math.min(255, Math.floor((pokemonLevel * (Math.random() * 255)) / 10))
        )
      );

    case "STATIC_DAMAGE":
      break;
    default:
      break;
  }
};
