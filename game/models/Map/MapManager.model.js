import { NPC_DATABASE } from "../../shareds/character/npc/npc.database.js";
import { NPC_LOCATION } from "../../shareds/character/npc/npcLocation.database.js";
import { ITEMS_DATABASE } from "../../shareds/items/items.database.js";
import { ITEM_LOCATION } from "../../shareds/items/itemsLocation.database.js";
import { TILES_SIZE } from "../../shareds/utils/tile/tile.utils.js";
import { Npc } from "../Character/Npc/npc.model.js";
import { MissableObject } from "../Character/Npc/object/missableObject.model.js";

export class MapManager {
  constructor(game, maps) {
    this.game = game;
    this.maps = maps;
    this.currentMap = this.maps["OAK_LAB"];
    this.loadMap(this.currentMap);
  }

  loadNpcs(map) {
    const mapNpcs = NPC_LOCATION[map.id];
    if (!mapNpcs) return;
    return mapNpcs.map((data) => {
      const config = NPC_DATABASE[data.id];
      const npc = new Npc({
        tileX: data.tileX,
        tileY: data.tileY,
        sprites: config.sprites,
        facing: config.facing,
        name: config.name,
        dialogTree: config.dialogTree,
        behavior: config.behavior,
        patrolPath: config.patrolPath,
      });
      return this.currentMap.npcs.push(npc);
    });
  }

  loadMissableObjs(map) {
    const mapMissableObjs = ITEM_LOCATION[map.id];
    if (!mapMissableObjs) return;

    return mapMissableObjs.map((data) => {
      const config = ITEMS_DATABASE[data.category][data.key];
      const item = new MissableObject({
        key: data.key,
        tileX: data.tileX,
        tileY: data.tileY,
        id: config.id,
        category: data.category,
        flagId: data.flagId,
        name: config.name,
      });
      return this.currentMap.missableObjects.push(item);
    });
  }

  filterMissableObjects() {
    this.currentMap.missableObjects = this.currentMap.missableObjects.filter(
      (object) => {
        if (!object.flagId) return true;
        return !this.game.flags[object.flagId];
      }
    );
  }

  removeCurrentMapNpcs() {
    return (this.currentMap.npcs = []);
  }

  removeCurrentMapMissableObjects() {
    return (this.currentMap.missableObjects = []);
  }

  loadMap(map) {
    this.removeCurrentMapNpcs();
    this.removeCurrentMapMissableObjects();
    this.loadNpcs(map);
    this.loadMissableObjs(map);
    this.filterMissableObjects();
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
      this.loadMap(this.currentMap);
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
        this.setCurrentMap(warp);
        this.loadMap(this.currentMap);
        this.updatePlayerPositionWithFacing(game, false, warp);
      },
      () => {
        game.togglePause(false, true);
        if (!this.currentMap.isIndoor)
          game.player.startForcedMovement(game.player.paths.exit);
      }
    );
  }

  setCurrentMap(warp) {
    return (this.currentMap = this.maps[warp.toMap]);
  }

  staticInteraction(front) {
    if (this.currentMap.interactions) {
      const interaction = this.currentMap.interactions.find(
        (i) => i.tile.x === front.x && i.tile.y === front.y
      );
      return interaction;
    }
  }

  npcInFrontOf(front) {
    return this.currentMap.npcs?.find(
      (npc) => npc.tileX === front.x && npc.tileY === front.y
    );
  }

  missableObjInFrontOf(front) {
    return this.currentMap.missableObjects?.find(
      (missableObj) =>
        missableObj.tileX === front.x && missableObj.tileY === front.y
    );
  }

  checkInteraction(player) {
    const front = player.getFrontTile();

    const staticInteraction = this.staticInteraction(front);
    if (staticInteraction)
      return this.triggerInteraction(staticInteraction, player);

    const npc = this.npcInFrontOf(front);
    if (npc) return npc.interact(this.game);

    const missableObj = this.missableObjInFrontOf(front);
    if (missableObj) return missableObj.interact(this.game);
  }

  triggerInteraction(staticInteraction, player) {
    if (
      staticInteraction.type === "sign" &&
      player.facing === staticInteraction.facing[player.facing]
    )
      this.game.openDialogBox(staticInteraction.text);
  }

  matchTrigger(trigger, player) {
    return trigger.positions.some((triggerPos) => {
      return (
        triggerPos.tileX === player.tileX && triggerPos.tileY === player.tileY
      );
    });
  }

  checkScenarios(player) {
    const scenarios = this.currentMap.scenarios;

    scenarios?.forEach((scenario) => {
      if (
        !scenario.hasTriggered &&
        this.matchTrigger(scenario.trigger, player) &&
        scenario.condition(this.game)
      ) {
        scenario.hasTriggered = true;
        scenario.action(this.game);
      }
    });
  }
}
