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
    const warp = this.game.currentMap.warps.find(
      (w) =>
        w.fromMap === this.game.currentMap.id &&
        w.from.x === player.tileX &&
        w.from.y === player.tileY
    );

    if (!warp) return;

    this.triggerWarp(warp);
  }

  triggerWarp(warp) {
    const game = this.game;

    game.isPaused = true;

    game.transition.start(
      () => {
        this.loadMap(warp.toMap);
        game.player.isCanMove = false;
        game.player.tileX = warp.to.x;
        game.player.tileY = warp.to.y;

        game.player.position.x = warp.to.x * TILES_SIZE;
        game.player.position.y = warp.to.y * TILES_SIZE;

        game.player.setFacing(warp.facing);
      },
      () => {
        game.isPaused = false;
        game.player.isCanMove = true;
      }
    );
  }

  checkInteraction(player) {
    const front = player.getFrontTile();
    const interaction = this.game.currentMap.interactions.find(
      (i) => i.tile.x === front.x && i.tile.y === front.y
    );

    if (!interaction) return;

    this.triggerInteraction(interaction, player);
  }

  triggerInteraction(interaction, player) {
    if (
      interaction.type === "sign" &&
      player.facing === interaction.facing[player.facing]
    )
      this.game.showDialog(interaction.text);
  }
}
