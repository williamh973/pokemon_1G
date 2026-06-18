import { SpriteViewer } from "../../../models/SpriteViewer/SpriteViewer.model.js";
import { getAnimationConfig } from "../pokemon/animations/pokemonAnimations.utils.js";

export const createSprite = (context) => {
  const viewer = (context.viewer = new SpriteViewer(
    context.game,
    getAnimationConfig(context.pokemonId, context.key),
    context.slot
  ));
  return viewer;
};
