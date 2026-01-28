import { GAME_FLAGS, TILES_SIZE } from "../../../../shareds/utils.js";

export class Save {
  constructor() {
    this.player = {
      tileX: 0,
      tileY: 0,
    };
    this.currentMapId = null;
    this.flags = null;
  }

  capture(game) {
    this.player.tileX = game.player.tileX;
    this.player.tileY = game.player.tileY;
    this.currentMapId = game.currentMap.id;
    this.flags = game.flags;
  }

  write() {
    localStorage.setItem("POKEMON_SAVE", JSON.stringify(this));
    const raw = localStorage.getItem("POKEMON_SAVE");
    console.log(raw);
  }

  static load() {
    const raw = localStorage.getItem("POKEMON_SAVE");
    if (!raw) return null;
    console.log(raw);
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
  }
}

// pour plus tard
//   name: "",
//   team: [],
//   inventory: {},
//   money: 0,
// };
// this.flags = {};
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
