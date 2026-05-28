import { POKEMON_IDLE_ANIMATIONS } from "../../../pokemon/animations/idle/pokemonIdleAnimation.database.js";
import { getSpeciesData } from "../species/species.utils.js";

export const getAnimationConfig = (configId, key) => {
  const species = getSpeciesData(configId);
  const speciesAnimations = species.animations;
  const animKey = speciesAnimations.idle[key];
  const animationConfig = POKEMON_IDLE_ANIMATIONS[species.id][animKey];
  return animationConfig;
};
