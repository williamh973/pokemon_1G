export const update = (game) => {
  game.player.update(game.canvas);
  game.tileManager.update();
};
//
