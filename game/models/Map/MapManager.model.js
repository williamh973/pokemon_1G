import { TILES_SIZE } from "../../shareds/utils.js";

export class MapManager {
  constructor(game, maps) {
    this.game = game;
    this.maps = maps;
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
    this.checkTransition(game, warp);
  }

  checkTransition(game, warp) {
    if (!warp.transition) {
      this.loadMap(warp.toMap);
      this.updatePlayerPositionWithFacing(game, true, warp);
    } else this.startTransition(game, warp);
  }

  updatePlayerPositionWithFacing(game, isCanMove, warp) {
    game.player.isCanMove = isCanMove;
    game.player.tileX = warp.to.x;
    game.player.tileY = warp.to.y;

    game.player.position.x = warp.to.x * TILES_SIZE;
    game.player.position.y = warp.to.y * TILES_SIZE;

    game.player.setFacing(warp.facing);
  }

  startTransition(game, warp) {
    game.togglePause(true, false);

    game.transition.start(
      () => {
        this.loadMap(warp.toMap);
        this.updatePlayerPositionWithFacing(game, false, warp);
      },
      () => {
        game.togglePause(false, true);
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
    ) {
      this.game.openDialogBox(interaction.text);
    }
  }
}
