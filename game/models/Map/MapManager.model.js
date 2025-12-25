import { warps } from "../../logic/gameplay/maps/warps/warps.js";
import { TILES_SIZE } from "../../shareds/utils.js";

export class MapManager {
  constructor(game, maps) {
    this.game = game;
    this.maps = maps;
    this.currentMap = null;
  }

  loadMap(mapId) {
    this.game.currentMap = this.maps[mapId];
  }

  checkWarp(player) {
    const warp = warps.find(
      (w) =>
        w.fromMap === this.game.currentMap.id &&
        w.from.x === player.tileX &&
        w.from.y === player.tileY
    );

    if (!warp) return;

    this.triggerWarp(warp);
  }

  triggerWarp(warp) {
    this.loadMap(warp.toMap);

    this.game.player.tileX = warp.to.x;
    this.game.player.tileY = warp.to.y;

    this.game.player.position.x = warp.to.x * TILES_SIZE;
    this.game.player.position.y = warp.to.y * TILES_SIZE;

    this.game.player.setFacing(warp.facing);
  }
}
