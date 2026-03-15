import { SCENARIOS_DATABASE } from "../../../../shareds/scenarios/scenarios.database.js";
import { serialize } from "../../../../shareds/utils/font/font.utils.js";
import { getItemById } from "../../../../shareds/utils/save/save.utils.js";
import { TILES_SIZE } from "../../../../shareds/utils/tile/tile.utils.JS";

export class Save {
  constructor() {
    this.player = {
      tileX: 0,
      tileY: 0,
    };
    this.currentMapId = null;
    this.flags = null;
    this.inventory = { categories: {} };
    this.map = {
      npcLocation: [],
      npcs: [],
      triggeredScenarios: [],
    };
  }

  capture(game) {
    this.player.tileX = game.player.tileX;
    this.player.tileY = game.player.tileY;
    this.currentMapId = game.mapManager.currentMap.id;

    this.flags = game.flags;

    const categories = {
      cares: serialize(game.player.inventory.cares),
      balls: serialize(game.player.inventory.balls),
      keys: serialize(game.player.inventory.keys),
      cTcS: serialize(game.player.inventory.cTcS),
    };
    this.inventory.categories = categories;

    this.map = {
      npcLocation: game.mapManager.npcLocation,
      npcs: game.mapManager.currentMap.npcs,
      // triggeredScenarios: foundTriggeredScenarios,
    };
  }

  write(game) {
    localStorage.setItem("POKEMON_SAVE", JSON.stringify(this));
    const raw = localStorage.getItem("POKEMON_SAVE");
    if (raw) game.isSaveCompleted = true;

    // console.log(raw);
  }

  static load() {
    const raw = localStorage.getItem("POKEMON_SAVE");
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Object.assign(new Save(), data);
  }

  apply(game) {
    game.player.tileX = this.player.tileX;
    game.player.tileY = this.player.tileY;
    game.player.position = {
      x: TILES_SIZE * game.player.tileX,
      y: TILES_SIZE * game.player.tileY,
    };

    game.flags = this.flags;

    game.player.inventory.cares = this.rebuild(
      game,
      this.inventory.categories.cares,
      "care"
    );
    game.player.inventory.balls = this.rebuild(
      game,
      this.inventory.categories.balls,
      "ball"
    );
    game.player.inventory.keys = this.rebuild(
      game,
      this.inventory.categories.keys,
      "key"
    );
    game.player.inventory.cTcS = this.rebuild(
      game,
      this.inventory.categories.cTcS,
      "CTCS"
    );
    game.mapManager.loadMap(this.currentMapId);
  }

  rebuild(game, savedList, categoryKey) {
    const rebuilt = [];

    savedList.forEach((savedItem) => {
      const baseItem = getItemById(categoryKey, savedItem.id);

      rebuilt.push({
        ...baseItem,
        count: savedItem.count,
      });
    });

    rebuilt.push(game.player.inventory.CANCEL_ITEM);

    return rebuilt;
  }
}

// pour plus tard
//   name: "",
//   team: [],
//   money: 0,
// };
// this.defeatedTrainers = [];
// this.pokedex = {
//   seen: [],
//   caught: [],
// };
// this.team = {};
// this.playTime = [];
// this.time = {
//   hour: 0,
//   minute: 0,
//   totalMinutes: 0,
// };
