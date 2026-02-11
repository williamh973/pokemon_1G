import { ITEMS_DATABASE } from "../../../../shareds/items/items.database.js";
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
    this.categories = {};
  }

  capture(game) {
    this.player.tileX = game.player.tileX;
    this.player.tileY = game.player.tileY;
    this.currentMapId = game.currentMap.id;
    this.flags = game.flags;

    const serialize = (list) =>
      list
        .filter((item) => item.id !== "RETOUR")
        .map((item) => ({
          id: item.id,
          count: item.count,
        }));

    const categories = {
      cares: serialize(game.inventory.cares),
      balls: serialize(game.inventory.balls),
      keys: serialize(game.inventory.keys),
      cTcS: serialize(game.inventory.cTcS),
    };

    this.categories = categories;
  }

  write() {
    localStorage.setItem("POKEMON_SAVE", JSON.stringify(this));
    const raw = localStorage.getItem("POKEMON_SAVE");
    console.log(raw);
  }

  static load() {
    const raw = localStorage.getItem("POKEMON_SAVE");
    if (!raw) return null;
    // console.log(raw);
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
    game.currentMap = map;
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

      rebuilt.push(game.inventory.CANCEL_ITEM);

      return rebuilt;
    };

    game.inventory.cares = rebuild(this.categories.cares, "care");
    game.inventory.balls = rebuild(this.categories.balls, "ball");
    game.inventory.keys = rebuild(this.categories.keys, "key");
    game.inventory.cTcS = rebuild(this.categories.cTcS, "CTCS");
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
