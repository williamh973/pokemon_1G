import { SCENARIO_SCRIPTS } from "../../logic/gameplay/scenarios/scenario.scripts.js";
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
    this.npcLocation = NPC_LOCATION[this.currentMap.id];
    this.moLocation = ITEM_LOCATION[this.currentMap.id];
    this.loadMap(this.currentMap.id); // pour dev uniquement
  }

  loadNpcs(map) {
    this.npcLocation = NPC_LOCATION[map.id];
    if (!this.npcLocation) return;

    return this.npcLocation.map((data) => {
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

  loadMap(mapId) {
    const map = this.mapsDatabase[mapId];
    this.currentMap = map;
    this.removeCurrentMapNpcs();
    this.removeCurrentMapMissableObjects();
    this.loadNpcs(map);
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
    game.togglePause(true, false);
    game.transition.start(
      () => {
        this.setCurrentMap(warp);
        this.loadMap(this.currentMap.id);
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
    return (this.currentMap = this.mapsDatabase[warp.toMap]);
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

  runScript(script) {
    const foundedScript = SCENARIO_SCRIPTS[this.currentMap.id][script];

    if (!foundedScript) {
      console.warn(`Script ${script} not found`);
      return;
    }

    foundedScript(this.game);
  }

  checkScenarios(player) {
    const scenarios = this.currentMap.scenarios;

    scenarios?.forEach((scenario) => {
      if (
        !scenario.hasTriggered &&
        this.matchTrigger(scenario.trigger, player) &&
        scenario.condition(this.game) &&
        scenario.script
      ) {
        this.runScript(scenario.script);
        scenario.hasTriggered = true;

        if (
          this.game.flags[this.currentMap.id].OAK_INTRO_LAB_DONE &&
          this.game.flags[this.currentMap.id].PLAYER_TRY_TO_LEAVE &&
          !this.game.flags[this.currentMap.id].BLUE_STARTER_CHOSEN_DONE
        ) {
          player.startForcedMovement(Array(1).fill("up"));
          scenario.hasTriggered = false;
        }
      }
    });
  }
}
