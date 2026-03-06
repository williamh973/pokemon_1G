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

    const map = game.mapManager.maps[this.currentMapId];
    game.mapManager.currentMap = map;
    game.flags = this.flags;

    const rebuild = (savedList, categoryKey) => {
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
    };

    game.player.inventory.cares = rebuild(
      this.inventory.categories.cares,
      "care"
    );
    game.player.inventory.balls = rebuild(
      this.inventory.categories.balls,
      "ball"
    );
    game.player.inventory.keys = rebuild(this.inventory.categories.keys, "key");
    game.player.inventory.cTcS = rebuild(
      this.inventory.categories.cTcS,
      "CTCS"
    );
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
