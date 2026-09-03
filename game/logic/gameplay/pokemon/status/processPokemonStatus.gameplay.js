import { POKEMON_STATUS } from "./pokemonStatus.state.js";

const deduction8 = (pokemonHp) => {
  return Math.floor(pokemonHp / 8);
};

const random = (percent) => {
  const random100 = Math.floor(Math.random() * 100) + 1;
  return random100 > percent;
};

export const processPokemonStatus = (pokemon) => {
  let canUseMove = true;

  switch (pokemon.status) {
    case POKEMON_STATUS.BURN:
      pokemon.stats.hp = Math.max(
        0,
        pokemon.stats.hp - deduction8(pokemon.stats.hp)
      );
      break;

    case POKEMON_STATUS.POISON:
      pokemon.stats.hp = Math.max(
        0,
        pokemon.stats.hp - deduction8(pokemon.stats.hp)
      );
      break;

    case POKEMON_STATUS.PARALYSIS:
    case POKEMON_STATUS.SLEEP:
    case POKEMON_STATUS.FREEZE:
      canUseMove = random(25);
      break;
  }

  return {
    canUseMove: canUseMove,
    pokemon: pokemon,
  };
};
