export const togglePause = (isPaused, isCanMove, game) => {
  game.isPaused = isPaused;
  game.player.isCanMove = isCanMove;
  game.mapManager.currentMap.npcs.forEach((npc) => (npc.isCanMove = isCanMove));
};
