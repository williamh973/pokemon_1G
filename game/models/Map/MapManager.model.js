import { TILES_SIZE } from "../../shareds/utils.js";

export class MapManager {
  constructor(game, maps) {
    this.game = game;
    this.maps = maps;
  }

  loadMap(mapId) {
    this.game.currentMap = this.maps[mapId];

    this.game.currentMap.npcs = this.game.currentMap.npcs.filter((npc) => {
      if (!npc.flagId) return true;
      return !this.game.flags[npc.flagId];
    });
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

  staticInteraction(front) {
    const interaction = this.game.currentMap.interactions.find(
      (i) => i.tile.x === front.x && i.tile.y === front.y
    );
    return interaction;
  }

  npcInteraction(front) {
    return this.game.currentMap.npcs?.find(
      (npc) => npc.tileX === front.x && npc.tileY === front.y
    );
  }

  checkInteraction(player) {
    const front = player.getFrontTile();

    const staticInteraction = this.staticInteraction(front);
    if (staticInteraction) {
      this.triggerInteraction(staticInteraction, player);
      return;
    }

    const npc = this.npcInteraction(front);
    if (npc) {
      npc.interact(this.game);
      return;
    }
  }

  triggerInteraction(staticInteraction, player) {
    if (
      staticInteraction.type === "sign" &&
      player.facing === staticInteraction.facing[player.facing]
    )
      this.game.openDialogBox(staticInteraction.text);
  }
}
