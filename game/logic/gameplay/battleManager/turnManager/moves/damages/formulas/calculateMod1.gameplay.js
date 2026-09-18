import { POKEMON_STATUS } from "../../../../../pokemon/status/pokemonStatus.state.js";
import { WEATHER_STATES } from "../../../../../weather/weatherStates.gameplay.js";

const determineBNR = (status) => {
  return status === POKEMON_STATUS.BURN ? 0.5 : 1;
};

const determineRL = (moveId) => {
  if (moveId === "protection" || moveId === "murLumière") return 0.5;
  else return 1;
};

const determineFF = (moveType, weatherState) => {
  if (
    (moveType === "WATER" && weatherState === WEATHER_STATES.RAIN) ||
    (moveType === "FIRE" && weatherState === WEATHER_STATES.SUN)
  )
    return 1.5;

  if (
    (moveType === "WATER" && weatherState === WEATHER_STATES.SUN) ||
    (moveType === "FIRE" && weatherState === WEATHER_STATES.RAIN)
  )
    return 0.5;

  return 1;
};

export const calculateMod1 = (action, weather) => {
  const move = action.move;
  const pokemon = action.pokemon;

  const BRN = determineBNR(pokemon.status);
  const RL = determineRL(move.id);
  const TVT = 1;
  const SR = 1;
  const FF = determineFF(move.type, weather);

  const result = BRN * RL * TVT * SR * FF;

  return result;
};
