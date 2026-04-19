export const moveEffects = (game, footX, footY) => {
  if (game.rainSystem?.intensity > 0) game.splashSystem.spawn(footX, footY);
};
