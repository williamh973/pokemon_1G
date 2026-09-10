import { POKEMON_STATUS } from "./pokemonStatus.state.js";

const deduction8 = (maxHp) => {
  return Math.floor(maxHp / 8);
};

const random = (percent) => {
  const random100 = Math.floor(Math.random() * 100) + 1;
  return random100 > percent;
};

export const processPokemonStatus = (pokemon) => {
  let canUseMove = true;
  let hasWokenUp = false;
  let hasThawedOut = false;
  let hasParalized = false;

  switch (pokemon.status) {
    case POKEMON_STATUS.BURN:
      pokemon.stats.hp = Math.max(
        0,
        pokemon.stats.hp - deduction8(pokemon.stats.maxHp)
      );
      break;

    case POKEMON_STATUS.POISON:
      pokemon.stats.hp = Math.max(
        0,
        pokemon.stats.hp - deduction8(pokemon.stats.maxHp)
      );
      break;

    case POKEMON_STATUS.PARALYSIS:
      canUseMove = random(25);
      hasParalized = !canUseMove;
      break;

    case POKEMON_STATUS.SLEEP:
      pokemon.volatils.sleepTurns--;

      if (pokemon.volatils.sleepTurns <= 0) {
        console.log(`${pokemon.name} se réveille !`);
        pokemon.status = POKEMON_STATUS.NONE;
        hasWokenUp = true;
        canUseMove = true;
      } else {
        hasWokenUp = false;
        canUseMove = false;
      }
      break;

    case POKEMON_STATUS.FREEZE:
      canUseMove = random(25);

      if (canUseMove) {
        pokemon.status = POKEMON_STATUS.NONE;
        hasThawedOut = true;
        console.log(`${pokemon.name} est dégelé !`);
      }

      break;
  }

  return {
    statusProcessed: pokemon.status !== POKEMON_STATUS.NONE,
    canUseMove,
    hasWokenUp,
    hasThawedOut,
    hasParalized,
    pokemon: pokemon,
  };
};
