import { checkInteractions } from "../../logic/gameplay/mapManager/interactions.gameplay.js";
import { checkScenarios } from "../../logic/gameplay/mapManager/scenarios.gameplay.js";
import { NPC_DATABASE } from "../../shareds/character/npc/npc.database.js";
import { NPC_LOCATION } from "../../shareds/character/npc/npcLocation.database.js";
import { ITEMS_DATABASE } from "../../shareds/items/items.database.js";
import { ITEM_LOCATION } from "../../shareds/items/itemsLocation.database.js";
import { spawnMO } from "../../shareds/utils/character/npc/spawnMissableObject.utils.js";
import { spawnNpc } from "../../shareds/utils/character/npc/spawnNpc.utils.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";

export class MapManager {
  constructor(game, mapsDatabase) {
    this.game = game;
    this.mapsDatabase = mapsDatabase;
    this.currentMap = this.mapsDatabase["PALLET_TOWN"]; // "PALLET_TOWN", "OAK_LAB", "RED_HOUSE_1F",
    this.moLocation = ITEM_LOCATION[this.currentMap.id];
  }

  loadNpcs(map, saveData) {
    const npcLocation = NPC_LOCATION[map.id];
    if (!npcLocation) return;

    saveData
      ? saveData.map.npcs.forEach((data) => {
          const config = NPC_DATABASE[data.id];
          const npc = spawnNpc(config, data, map);
          return npc;
        })
      : npcLocation.map((data) => {
          const config = NPC_DATABASE[data.id];
          const npc = spawnNpc(config, data, map);
          return npc;
        });
  }

  loadMO(map) {
    this.moLocation = ITEM_LOCATION[map.id];
    if (!this.moLocation) return;

    return this.moLocation.map((data) => {
      const config = ITEMS_DATABASE[data.category][data.key];
      const item = spawnMO(map, config, data);
      return item;
    });
  }

  filterMissableObjects(mapId) {
    this.currentMap.missableObjects = this.currentMap.missableObjects.filter(
      (object) => {
        if (!object.flagId) return true;
        return !this.game.flags[mapId][object.flagId];
      }
    );
  }
  removeCurrentMapNpcs() {
    return (this.currentMap.npcs = []);
  }

  removeCurrentMapMissableObjects() {
    return (this.currentMap.missableObjects = []);
  }

  loadMap(mapId, saveData) {
    const map = this.mapsDatabase[mapId];
    this.currentMap = map;
    this.removeCurrentMapNpcs();
    this.removeCurrentMapMissableObjects();
    this.loadNpcs(map, saveData);
    this.loadMO(map);
    this.filterMissableObjects(mapId);
  }

  checkWarp(player) {
    const warp = this.currentMap.warps.find(
      (w) =>
        w.fromMap === this.currentMap.id &&
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
      this.setCurrentMap(warp);
      this.loadMap(this.currentMap.id);
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
    game.transition.start(
      () => {
        game.togglePause(true, false);
      },
      (done) => {
        this.setCurrentMap(warp);
        this.loadMap(this.currentMap.id);
        this.updatePlayerPositionWithFacing(game, false, warp);
        if (!this.currentMap.isIndoor)
          game.player.startForcedMovement(game.player.paths.exit);
        done();
      },
      () => {
        game.togglePause(false, true);
      }
    );
  }

  setCurrentMap(warp) {
    return (this.currentMap = this.mapsDatabase[warp.toMap]);
  }

  checkInteraction(player) {
    checkInteractions(this.game, player);
  }

  checkScenarios(game) {
    checkScenarios(game);
  }
}
